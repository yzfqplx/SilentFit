mod commands; // Import the commands module

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
        commands::nedb_find,
        commands::nedb_insert,
        commands::nedb_update,
        commands::nedb_remove,
        commands::nedb_clear_collection,
        commands::nedb_bulk_insert,
        commands::theme_set,
        commands::theme_get
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
