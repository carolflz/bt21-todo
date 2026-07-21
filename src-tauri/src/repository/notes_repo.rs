use rusqlite::{params, Connection, Row};

use crate::db::models::Note;
use crate::error::AppResult;

pub fn create_note(
    conn: &Connection,
    id: &str,
    project_id: &str,
    title: &str,
    body: &str,
    color: &str,
    pos_x: f64,
    pos_y: f64,
) -> AppResult<Note> {
    conn.execute(
        "INSERT INTO notes (id, project_id, title, body, color, pos_x, pos_y) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id, project_id, title, body, color, pos_x, pos_y],
    )?;
    get_note(conn, id)
}

pub fn get_note(conn: &Connection, id: &str) -> AppResult<Note> {
    conn.query_row(
        "SELECT id, project_id, title, body, color, pos_x, pos_y, width, height, pinned, created_at, updated_at
         FROM notes WHERE id = ?1",
        params![id],
        map_note_row,
    )
    .map_err(Into::into)
}

pub fn list_notes_for_project(conn: &Connection, project_id: &str) -> AppResult<Vec<Note>> {
    let mut stmt = conn.prepare(
        "SELECT id, project_id, title, body, color, pos_x, pos_y, width, height, pinned, created_at, updated_at
         FROM notes WHERE project_id = ?1 ORDER BY created_at",
    )?;
    let rows = stmt
        .query_map(params![project_id], map_note_row)?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[allow(clippy::too_many_arguments)]
pub fn update_note(
    conn: &Connection,
    id: &str,
    title: &str,
    body: &str,
    color: &str,
    pos_x: f64,
    pos_y: f64,
    width: f64,
    height: f64,
    pinned: bool,
) -> AppResult<Note> {
    conn.execute(
        "UPDATE notes SET title = ?1, body = ?2, color = ?3, pos_x = ?4, pos_y = ?5, width = ?6, height = ?7, pinned = ?8, updated_at = datetime('now')
         WHERE id = ?9",
        params![title, body, color, pos_x, pos_y, width, height, pinned, id],
    )?;
    get_note(conn, id)
}

pub fn delete_note(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;
    Ok(())
}

fn map_note_row(row: &Row) -> rusqlite::Result<Note> {
    Ok(Note {
        id: row.get(0)?,
        project_id: row.get(1)?,
        title: row.get(2)?,
        body: row.get(3)?,
        color: row.get(4)?,
        pos_x: row.get(5)?,
        pos_y: row.get(6)?,
        width: row.get(7)?,
        height: row.get(8)?,
        pinned: row.get(9)?,
        created_at: row.get(10)?,
        updated_at: row.get(11)?,
    })
}
