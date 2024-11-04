use tauri::Runtime;
use tauri::Manager;

mod commands;
use crate::commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run<R: Runtime>() where R: Runtime {
    tauri::Builder::<R>::new()
        .invoke_handler(tauri::generate_handler![
            calculate_checksum
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.set_decorations(true).unwrap();
            window.show().unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}