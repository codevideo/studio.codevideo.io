//! Project files. The webview can't read or write files itself: it asks for
//! them here, and the user picks them in the system's Open and Save dialogs.

use std::path::{Path, PathBuf};

use serde::Serialize;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

/// Larger than any real project; a guard against opening the wrong file.
const MAX_PROJECT_BYTES: u64 = 50 * 1024 * 1024;

#[derive(Serialize)]
pub struct ProjectFile {
    path: String,
    contents: String,
}

#[tauri::command]
pub async fn open_project_file(app: AppHandle) -> Result<Option<ProjectFile>, String> {
    let Some(file) = app
        .dialog()
        .file()
        .set_title("Open project")
        .add_filter("CodeVideo project", &["json"])
        .blocking_pick_file()
    else {
        return Ok(None);
    };
    let path = file.into_path().map_err(|e| e.to_string())?;
    let size = std::fs::metadata(&path)
        .map_err(|e| format!("Could not read {}: {e}", path.display()))?
        .len();
    if size > MAX_PROJECT_BYTES {
        return Err(format!("{} is too large to be a project.", path.display()));
    }
    let contents = std::fs::read_to_string(&path)
        .map_err(|e| format!("Could not read {}: {e}", path.display()))?;
    Ok(Some(ProjectFile {
        path: path.display().to_string(),
        contents,
    }))
}

/// Saves to `path` when the project already has a file, otherwise asks where.
#[tauri::command]
pub async fn save_project_file(
    app: AppHandle,
    contents: String,
    suggested_name: String,
    path: Option<String>,
) -> Result<Option<String>, String> {
    let known = path
        .map(PathBuf::from)
        .filter(|p| is_json(p) && p.parent().is_some_and(Path::is_dir));
    let target = match known {
        Some(path) => path,
        None => match app
            .dialog()
            .file()
            .set_title("Save project")
            .set_file_name(&suggested_name)
            .add_filter("CodeVideo project", &["json"])
            .blocking_save_file()
        {
            Some(file) => file.into_path().map_err(|e| e.to_string())?,
            None => return Ok(None),
        },
    };
    // Write next to the file, then swap it in, so a failed save can't leave half a project.
    let partial = target.with_extension("json.partial");
    std::fs::write(&partial, contents)
        .and_then(|_| std::fs::rename(&partial, &target))
        .map_err(|e| {
            let _ = std::fs::remove_file(&partial);
            format!("Could not save {}: {e}", target.display())
        })?;
    Ok(Some(target.display().to_string()))
}

fn is_json(path: &Path) -> bool {
    path.extension()
        .is_some_and(|e| e.eq_ignore_ascii_case("json"))
}

#[tauri::command]
pub fn reveal_path(path: String) -> Result<(), String> {
    tauri_plugin_opener::reveal_item_in_dir(path).map_err(|e| e.to_string())
}
