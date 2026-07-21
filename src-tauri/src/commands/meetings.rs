use tauri::State;

use crate::db::models::{Meeting, MeetingWithDetails, SaveMeetingInput};
use crate::error::AppResult;
use crate::repository::{action_items_repo, meetings_repo};
use crate::state::AppState;

#[tauri::command]
pub fn save_meeting(state: State<AppState>, input: SaveMeetingInput) -> AppResult<MeetingWithDetails> {
    let mut conn = state.pool.get()?;
    meetings_repo::save_meeting_with_action_items(&mut conn, &input)
}

#[tauri::command]
pub fn get_meeting(state: State<AppState>, id: String) -> AppResult<MeetingWithDetails> {
    let conn = state.pool.get()?;
    meetings_repo::get_meeting_with_details(&conn, &id)
}

#[tauri::command]
pub fn list_meetings(state: State<AppState>, project_id: String) -> AppResult<Vec<Meeting>> {
    let conn = state.pool.get()?;
    meetings_repo::list_meetings_for_project(&conn, &project_id)
}

#[tauri::command]
pub fn delete_meeting(state: State<AppState>, id: String) -> AppResult<()> {
    let conn = state.pool.get()?;
    meetings_repo::delete_meeting(&conn, &id)
}

#[tauri::command]
pub fn set_action_item_done(state: State<AppState>, id: String, is_done: bool) -> AppResult<()> {
    let conn = state.pool.get()?;
    action_items_repo::set_action_item_done(&conn, &id, is_done)
}
