//! The programs bundled with the app: Node, Chrome for Testing, FFmpeg, the
//! CodeVideo CLI and the codevideo-tts speech service. scripts/desktop/
//! prepare-runtime.mjs puts them in src-tauri/runtime/ and writes manifest.json,
//! which says where each one is.

use std::path::{Path, PathBuf};
use std::process::Command;

use serde::Deserialize;
use tauri::{AppHandle, Manager};

#[derive(Deserialize)]
struct Manifest {
    paths: Paths,
}

/// Paths relative to the runtime folder.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Paths {
    node: String,
    chrome: String,
    ffmpeg: String,
    ffprobe: String,
    cli: String,
    runner: String,
    tts_host: String,
}

pub struct Runtime {
    pub node: PathBuf,
    pub chrome: PathBuf,
    pub ffmpeg: PathBuf,
    pub ffprobe: PathBuf,
    pub cli: PathBuf,
    /// The CLI's Puppeteer runner (recordVideoV3.js), next to its node_modules.
    pub runner: PathBuf,
    pub tts_host: PathBuf,
}

impl Runtime {
    /// The runtime inside the app bundle, or CODEVIDEO_DESKTOP_RUNTIME_DIR
    /// (for `tauri dev`, so the runtime isn't copied on every build).
    pub fn locate(app: &AppHandle) -> Result<Runtime, String> {
        let dir = match std::env::var_os("CODEVIDEO_DESKTOP_RUNTIME_DIR") {
            Some(dir) => PathBuf::from(dir),
            None => app
                .path()
                .resource_dir()
                .map_err(|e| format!("Could not find the app's resources: {e}"))?
                .join("runtime"),
        };
        let manifest_path = dir.join("manifest.json");
        let manifest = std::fs::read(&manifest_path).map_err(|e| {
            format!(
                "The bundled runtime is missing ({}): {e}",
                manifest_path.display()
            )
        })?;
        let manifest: Manifest = serde_json::from_slice(&manifest)
            .map_err(|e| format!("{} is not valid: {e}", manifest_path.display()))?;
        let at = |relative: &str| dir.join(relative);
        Ok(Runtime {
            node: at(&manifest.paths.node),
            chrome: at(&manifest.paths.chrome),
            ffmpeg: at(&manifest.paths.ffmpeg),
            ffprobe: at(&manifest.paths.ffprobe),
            cli: at(&manifest.paths.cli),
            runner: at(&manifest.paths.runner),
            tts_host: at(&manifest.paths.tts_host),
        })
    }

    /// Folders to put first on PATH: the CLI runs `node`, and the speech
    /// service runs `ffmpeg`, by name.
    pub fn program_dirs(&self) -> Vec<PathBuf> {
        [&self.node, &self.ffmpeg]
            .iter()
            .filter_map(|p| p.parent().map(Path::to_path_buf))
            .collect()
    }
}

/// Variables a child may keep from the app's environment. Everything else is
/// dropped, so keys and webhooks in the user's shell (ElevenLabs, S3, Slack)
/// never reach the CLI: a desktop render is offline and private.
const KEEP: &[&str] = &[
    "HOME",
    "USER",
    "LOGNAME",
    "TMPDIR",
    "TEMP",
    "TMP",
    "LANG",
    "LC_ALL",
    "LC_CTYPE",
    "SystemRoot",
    "SYSTEMROOT",
    "WINDIR",
    "USERPROFILE",
    "LOCALAPPDATA",
    "APPDATA",
    "PROGRAMDATA",
    "ProgramFiles",
    "COMSPEC",
    "PATHEXT",
    "SystemDrive",
    "HOMEDRIVE",
    "HOMEPATH",
    "USERNAME",
    "PROCESSOR_ARCHITECTURE",
    "NUMBER_OF_PROCESSORS",
    "XDG_RUNTIME_DIR",
    "DISPLAY",
    "WAYLAND_DISPLAY",
];

/// A command with a clean environment and the bundled programs first on PATH.
pub fn command(program: &Path, runtime: &Runtime) -> Command {
    let mut cmd = Command::new(program);
    cmd.env_clear();
    for key in KEEP {
        if let Some(value) = std::env::var_os(key) {
            cmd.env(key, value);
        }
    }
    let mut path = runtime.program_dirs();
    path.extend(system_path());
    if let Ok(joined) = std::env::join_paths(path) {
        cmd.env("PATH", joined);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd
}

#[cfg(windows)]
fn system_path() -> Vec<PathBuf> {
    std::env::var_os("PATH")
        .map(|p| std::env::split_paths(&p).collect())
        .unwrap_or_default()
}

#[cfg(not(windows))]
fn system_path() -> Vec<PathBuf> {
    ["/usr/bin", "/bin", "/usr/sbin", "/sbin"]
        .iter()
        .map(PathBuf::from)
        .collect()
}

/// A folder in the app's cache (`~/Library/Caches/io.codevideo.studio/<name>` on macOS).
pub fn cache_dir(app: &AppHandle, name: &str) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_cache_dir()
        .map_err(|e| format!("Could not find the app's cache folder: {e}"))?
        .join(name);
    std::fs::create_dir_all(&dir)
        .map_err(|e| format!("Could not create {}: {e}", dir.display()))?;
    Ok(dir)
}
