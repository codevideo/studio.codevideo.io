//! Renders with the bundled CodeVideo CLI: the same program, flags and render
//! page as `codevideo` on the command line and the cloud worker.

use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::Stdio;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use tauri::ipc::Channel;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_dialog::DialogExt;

use crate::runtime::{self, Runtime};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RenderRequest {
    /// The CLI's project JSON (here, the lesson's actions).
    project: String,
    takes: Vec<Take>,
    orientation: String,
    resolution: String,
    suggested_name: String,
}

/// The CLI's --audio-items entries.
#[derive(Deserialize, Serialize)]
struct Take {
    text: String,
    path: String,
}

#[derive(Serialize, Clone)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum RenderEvent {
    Progress {
        stage: String,
        fraction: f64,
        detail: String,
    },
    Result {
        path: String,
    },
    Error {
        message: String,
    },
}

/// The running render, if any: one at a time, like the CLI's own lock on Chrome.
#[derive(Default)]
pub struct Renders {
    pid: Mutex<Option<u32>>,
    cancelled: AtomicBool,
}

impl Renders {
    pub fn stop(&self) {
        if let Some(pid) = *self.pid.lock().unwrap() {
            interrupt(pid);
        }
    }
}

/// Asks the CLI to stop. It handles SIGINT by closing Chrome and its files.
#[cfg(unix)]
fn interrupt(pid: u32) {
    unsafe {
        libc::kill(pid as libc::pid_t, libc::SIGINT);
    }
}

/// Windows has no SIGINT for another process: end the CLI and its children.
#[cfg(windows)]
fn interrupt(pid: u32) {
    use std::os::windows::process::CommandExt;
    let _ = std::process::Command::new("taskkill")
        .args(["/PID", &pid.to_string(), "/T", "/F"])
        .creation_flags(0x0800_0000)
        .status();
}

#[tauri::command]
pub async fn render_video(
    app: AppHandle,
    renders: State<'_, Renders>,
    request: RenderRequest,
    on_event: Channel<RenderEvent>,
) -> Result<Option<String>, String> {
    if !matches!(request.orientation.as_str(), "landscape" | "portrait")
        || !matches!(request.resolution.as_str(), "1080p" | "4K")
    {
        return Err("Unknown orientation or resolution.".into());
    }
    if renders.pid.lock().unwrap().is_some() {
        return Err("A video is already rendering.".into());
    }
    let Some(output) = app
        .dialog()
        .file()
        .set_title("Save video")
        .set_file_name(&request.suggested_name)
        .add_filter("MP4 video", &["mp4"])
        .blocking_save_file()
    else {
        return Ok(None);
    };
    let output = output.into_path().map_err(|e| e.to_string())?;
    let output = if output
        .extension()
        .is_some_and(|e| e.eq_ignore_ascii_case("mp4"))
    {
        output
    } else {
        output.with_extension("mp4")
    };

    let runtime = Runtime::locate(&app)?;
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or_default();
    let job = runtime::cache_dir(&app, "render")?.join(stamp.to_string());
    let work = job.join("work");
    std::fs::create_dir_all(&work).map_err(|e| e.to_string())?;
    let logs = app.path().app_log_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&logs).map_err(|e| e.to_string())?;
    let project = job.join("project.json");
    let takes = job.join("takes.json");
    let no_env = job.join("empty.env");
    std::fs::write(&project, &request.project).map_err(|e| e.to_string())?;
    std::fs::write(
        &takes,
        serde_json::to_vec(&request.takes).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    std::fs::write(&no_env, b"").map_err(|e| e.to_string())?;

    let mut child = runtime::command(&runtime.cli, &runtime)
        .arg("--project-file")
        .arg(&project)
        .arg("--audio-items")
        .arg(&takes)
        .arg("--output")
        .arg(&output)
        .args(["--orientation", &request.orientation])
        .args(["--resolution", &request.resolution])
        .args(["--progress", "json"])
        .env("CODEVIDEO_PUPPETEER_RUNNER_PATH", &runtime.runner)
        .env("CODEVIDEO_CHROME_PATH", &runtime.chrome)
        .env("CODEVIDEO_FFMPEG_PATH", &runtime.ffmpeg)
        .env("CODEVIDEO_FFPROBE_PATH", &runtime.ffprobe)
        .env("CODEVIDEO_WORK_DIR", &work)
        .env("CODEVIDEO_LOG_DIR", &logs)
        .env("CODEVIDEO_TTS_CACHE_DIR", job.join("tts"))
        .env(
            "CODEVIDEO_OUTPUT_DIR",
            output.parent().map(PathBuf::from).unwrap_or_default(),
        )
        // Read no .env file, and never call a TTS service: every line has a take.
        .env("CODEVIDEO_ENV_FILE", &no_env)
        .env("CODEVIDEO_TTS_PROVIDER", "kokoro")
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Could not start the renderer: {e}"))?;

    renders.cancelled.store(false, Ordering::SeqCst);
    *renders.pid.lock().unwrap() = Some(child.id());
    let stdout = child.stdout.take().expect("piped stdout");
    let stderr = child.stderr.take().expect("piped stderr");
    let events = on_event.clone();

    let result = tauri::async_runtime::spawn_blocking(move || {
        // The saved path is also printed on stdout; the JSON lines on stderr have it too.
        let drain = std::thread::spawn(move || {
            let _ = std::io::copy(&mut BufReader::new(stdout), &mut std::io::sink());
        });
        let mut last_error = None;
        for line in BufReader::new(stderr).lines().map_while(Result::ok) {
            let Ok(event) = serde_json::from_str::<serde_json::Value>(&line) else {
                continue;
            };
            if let Some(stage) = event.get("stage").and_then(|s| s.as_str()) {
                let _ = events.send(RenderEvent::Progress {
                    stage: stage.into(),
                    fraction: event
                        .get("fraction")
                        .and_then(|f| f.as_f64())
                        .unwrap_or(0.0),
                    detail: event
                        .get("detail")
                        .and_then(|d| d.as_str())
                        .unwrap_or("")
                        .into(),
                });
            } else if let Some(path) = event.get("result").and_then(|r| r.as_str()) {
                let _ = events.send(RenderEvent::Result { path: path.into() });
            } else if let Some(error) = event.get("error").and_then(|e| e.as_str()) {
                let _ = events.send(RenderEvent::Error {
                    message: error.into(),
                });
                last_error = Some(error.to_string());
            }
        }
        let status = child.wait();
        let _ = drain.join();
        (status, last_error)
    })
    .await
    .map_err(|e| e.to_string());

    *renders.pid.lock().unwrap() = None;
    let _ = std::fs::remove_dir_all(&job);
    let (status, last_error) = result?;
    let status = status.map_err(|e| e.to_string())?;
    if renders.cancelled.swap(false, Ordering::SeqCst) {
        let _ = std::fs::remove_file(&output);
        return Err("Render cancelled.".into());
    }
    if status.success() && output.is_file() {
        return Ok(Some(output.display().to_string()));
    }
    Err(format!(
        "{} (The renderer's log is in {}.)",
        last_error.unwrap_or_else(|| format!("The render failed ({status}).")),
        logs.display()
    ))
}

#[tauri::command]
pub fn cancel_render(renders: State<'_, Renders>) {
    if let Some(pid) = *renders.pid.lock().unwrap() {
        renders.cancelled.store(true, Ordering::SeqCst);
        interrupt(pid);
    }
}
