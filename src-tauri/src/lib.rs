pub mod commands;
pub mod db;
pub mod error;
pub mod repository;
pub mod state;

use tauri::Manager;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;
            let db_path = app_data_dir.join("todo-app.sqlite3");

            let pool = db::connection::init_pool(db_path);
            {
                let mut conn = pool.get()?;
                db::migrations::run_migrations(&mut conn);
            }

            app.manage(AppState { pool });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::projects::create_project,
            commands::projects::list_projects,
            commands::projects::rename_project,
            commands::projects::archive_project,
            commands::projects::unarchive_project,
            commands::projects::delete_project,
            commands::notes::create_note,
            commands::notes::list_notes,
            commands::notes::update_note,
            commands::notes::delete_note,
            commands::meetings::save_meeting,
            commands::meetings::get_meeting,
            commands::meetings::list_meetings,
            commands::meetings::delete_meeting,
            commands::meetings::set_action_item_done,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
