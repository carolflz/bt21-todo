use tauri::State;
use uuid::Uuid;

use crate::db::models::{Note, UpdateNoteInput};
use crate::error::AppResult;
use crate::repository::notes_repo;
use crate::state::AppState;

#[tauri::command]
pub fn create_note(
    state: State<AppState>,
    project_id: String,
    pos_x: f64,
    pos_y: f64,
    color: String,
) -> AppResult<Note> {
    let conn = state.pool.get()?;
    let id = Uuid::new_v4().to_string();
    notes_repo::create_note(&conn, &id, &project_id, "", "", &color, pos_x, pos_y)
}

#[tauri::command]
pub fn list_notes(state: State<AppState>, project_id: String) -> AppResult<Vec<Note>> {
    let conn = state.pool.get()?;
    notes_repo::list_notes_for_project(&conn, &project_id)
}

#[tauri::command]
pub fn update_note(state: State<AppState>, id: String, input: UpdateNoteInput) -> AppResult<Note> {
    let conn = state.pool.get()?;
    notes_repo::update_note(
        &conn,
        &id,
        &input.title,
        &input.body,
        &input.color,
        input.pos_x,
        input.pos_y,
        input.width,
        input.height,
        input.pinned,
    )
}

#[tauri::command]
pub fn delete_note(state: State<AppState>, id: String) -> AppResult<()> {
    let conn = state.pool.get()?;
    notes_repo::delete_note(&conn, &id)
}
