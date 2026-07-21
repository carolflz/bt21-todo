use tauri::State;
use uuid::Uuid;

use crate::db::models::Project;
use crate::error::AppResult;
use crate::repository::projects_repo;
use crate::state::AppState;

#[tauri::command]
pub fn create_project(state: State<AppState>, name: String, color_tag: String) -> AppResult<Project> {
    let conn = state.pool.get()?;
    let id = Uuid::new_v4().to_string();
    projects_repo::create_project(&conn, &id, &name, &color_tag)
}

#[tauri::command]
pub fn list_projects(state: State<AppState>, status: Option<String>) -> AppResult<Vec<Project>> {
    let conn = state.pool.get()?;
    projects_repo::list_projects(&conn, status.as_deref())
}

#[tauri::command]
pub fn rename_project(state: State<AppState>, id: String, name: String) -> AppResult<Project> {
    let conn = state.pool.get()?;
    projects_repo::rename_project(&conn, &id, &name)
}

#[tauri::command]
pub fn archive_project(state: State<AppState>, id: String) -> AppResult<Project> {
    let conn = state.pool.get()?;
    projects_repo::set_project_status(&conn, &id, "archived")
}

#[tauri::command]
pub fn unarchive_project(state: State<AppState>, id: String) -> AppResult<Project> {
    let conn = state.pool.get()?;
    projects_repo::set_project_status(&conn, &id, "active")
}

#[tauri::command]
pub fn delete_project(state: State<AppState>, id: String) -> AppResult<()> {
    let conn = state.pool.get()?;
    projects_repo::delete_project(&conn, &id)
}
