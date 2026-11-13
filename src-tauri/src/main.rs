// No console window next to the app on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;
mod render;
mod runtime;
mod tts;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(tts::Speech::default())
        .manage(render::Renders::default())
        .invoke_handler(tauri::generate_handler![
            tts::tts_speak,
            render::render_video,
            render::cancel_render,
            files::open_project_file,
            files::save_project_file,
            files::reveal_path,
        ])
        .build(tauri::generate_context!())
        .expect("CodeVideo Studio could not start")
        .run(|app, event| {
            if let tauri::RunEvent::Exit = event {
                // Don't leave the speech service or a render (and its Chrome) running.
                app.state::<render::Renders>().stop();
                app.state::<tts::Speech>().stop();
            }
        });
}
