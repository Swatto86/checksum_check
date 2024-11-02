use tauri::Runtime;

mod commands;
use crate::commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run<R: Runtime>() where R: Runtime {
    tauri::Builder::<R>::new()
        .invoke_handler(tauri::generate_handler![
            calculate_checksum
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}