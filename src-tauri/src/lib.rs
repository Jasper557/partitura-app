#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .setup(|app| {
        use tauri_plugin_notification::NotificationExt;
        app.notification()
            .builder()
            .title("Tauri")
            .body("Tauri is awesome")
            .show()
            .unwrap();

        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
