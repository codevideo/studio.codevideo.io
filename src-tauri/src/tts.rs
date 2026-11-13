//! Kokoro speech: one long-lived Node process running the bundled tts host
//! (runtime/tts/desktop-host.mjs), which calls codevideo-tts's own synthesis.
//! Requests and replies are one JSON object per line on its stdin and stdout.

use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, ChildStdin, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{mpsc, Arc, Mutex};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, State};

use crate::runtime::{self, Runtime};

/// A take the host wrote to the app's cache.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpokenTake {
    asset_id: String,
    path: String,
    voice: String,
    speed: f64,
}

#[derive(Deserialize)]
struct Reply {
    id: u64,
    take: Option<SpokenTake>,
    error: Option<String>,
}

type Waiting = Arc<Mutex<HashMap<u64, mpsc::Sender<Result<SpokenTake, String>>>>>;

struct Host {
    child: Child,
    stdin: ChildStdin,
    waiting: Waiting,
}

#[derive(Default)]
pub struct Speech {
    host: Mutex<Option<Host>>,
    next_id: AtomicU64,
}

impl Speech {
    fn request(
        &self,
        app: &AppHandle,
        text: &str,
        voice: &str,
        speed: f64,
    ) -> Result<mpsc::Receiver<Result<SpokenTake, String>>, String> {
        let mut host = self.host.lock().unwrap();
        let running = host
            .as_mut()
            .is_some_and(|h| matches!(h.child.try_wait(), Ok(None)));
        if !running {
            *host = Some(start(app)?);
        }
        let host = host.as_mut().unwrap();
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let (reply, receive) = mpsc::channel();
        host.waiting.lock().unwrap().insert(id, reply);
        let line = serde_json::json!({ "id": id, "text": text, "voice": voice, "speed": speed });
        if let Err(e) = writeln!(host.stdin, "{line}").and_then(|_| host.stdin.flush()) {
            host.waiting.lock().unwrap().remove(&id);
            return Err(format!("The speech service stopped: {e}"));
        }
        Ok(receive)
    }

    pub fn stop(&self) {
        if let Some(mut host) = self.host.lock().unwrap().take() {
            let _ = host.child.kill();
            let _ = host.child.wait();
        }
    }
}

fn start(app: &AppHandle) -> Result<Host, String> {
    let runtime = Runtime::locate(app)?;
    let cache = runtime::cache_dir(app, "tts")?;
    let mut child = runtime::command(&runtime.node, &runtime)
        .arg(&runtime.tts_host)
        .env("CODEVIDEO_TTS_CACHE_DIR", &cache)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Could not start the speech service: {e}"))?;
    let stdin = child.stdin.take().expect("piped stdin");
    let stdout = child.stdout.take().expect("piped stdout");
    let stderr = child.stderr.take().expect("piped stderr");
    let waiting: Waiting = Arc::default();
    let replies = waiting.clone();
    std::thread::spawn(move || {
        for line in BufReader::new(stdout).lines().map_while(Result::ok) {
            let Ok(reply) = serde_json::from_str::<Reply>(&line) else {
                continue;
            };
            if let Some(waiter) = replies.lock().unwrap().remove(&reply.id) {
                let _ = waiter.send(match (reply.take, reply.error) {
                    (Some(take), None) => Ok(take),
                    (_, error) => Err(error.unwrap_or_else(|| "Speech failed.".into())),
                });
            }
        }
        // The host exited: nothing still waiting will get an answer.
        for (_, waiter) in replies.lock().unwrap().drain() {
            let _ = waiter.send(Err("The speech service stopped.".into()));
        }
    });
    std::thread::spawn(move || {
        for line in BufReader::new(stderr).lines().map_while(Result::ok) {
            eprintln!("[speech] {line}");
        }
    });
    Ok(Host {
        child,
        stdin,
        waiting,
    })
}

/// Speaks `text` with a Kokoro voice. Takes are cached by their request, so the
/// same text, voice and speed returns the same file.
#[tauri::command]
pub async fn tts_speak(
    app: AppHandle,
    speech: State<'_, Speech>,
    text: String,
    voice: String,
    speed: f64,
) -> Result<SpokenTake, String> {
    let length = text.trim().chars().count();
    if length == 0 || length > 1000 {
        return Err("Speech needs 1–1000 characters.".into());
    }
    let reply = speech.request(&app, &text, &voice, speed)?;
    tauri::async_runtime::spawn_blocking(move || {
        reply
            .recv()
            .unwrap_or_else(|_| Err("The speech service stopped.".into()))
    })
    .await
    .map_err(|e| e.to_string())?
}
