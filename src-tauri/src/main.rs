#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    checksum_check::run::<tauri::Wry>();
}