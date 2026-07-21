use rusqlite::{params, Connection, Row};

use crate::db::models::Project;
use crate::db::DEFAULT_WORKSPACE_ID;
use crate::error::AppResult;

pub fn create_project(conn: &Connection, id: &str, name: &str, color_tag: &str) -> AppResult<Project> {
    conn.execute(
        "INSERT INTO projects (id, workspace_id, name, color_tag) VALUES (?1, ?2, ?3, ?4)",
        params![id, DEFAULT_WORKSPACE_ID, name, color_tag],
    )?;
    get_project(conn, id)
}

pub fn get_project(conn: &Connection, id: &str) -> AppResult<Project> {
    conn.query_row(
        "SELECT id, name, color_tag, status, created_at, updated_at FROM projects WHERE id = ?1",
        params![id],
        map_project_row,
    )
    .map_err(Into::into)
}

pub fn list_projects(conn: &Connection, status: Option<&str>) -> AppResult<Vec<Project>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color_tag, status, created_at, updated_at FROM projects
         WHERE workspace_id = ?1 AND (?2 IS NULL OR status = ?2)
         ORDER BY created_at",
    )?;
    let rows = stmt
        .query_map(params![DEFAULT_WORKSPACE_ID, status], map_project_row)?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

pub fn rename_project(conn: &Connection, id: &str, name: &str) -> AppResult<Project> {
    conn.execute(
        "UPDATE projects SET name = ?1, updated_at = datetime('now') WHERE id = ?2",
        params![name, id],
    )?;
    get_project(conn, id)
}

pub fn set_project_status(conn: &Connection, id: &str, status: &str) -> AppResult<Project> {
    conn.execute(
        "UPDATE projects SET status = ?1, updated_at = datetime('now') WHERE id = ?2",
        params![status, id],
    )?;
    get_project(conn, id)
}

pub fn delete_project(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM projects WHERE id = ?1", params![id])?;
    Ok(())
}

fn map_project_row(row: &Row) -> rusqlite::Result<Project> {
    Ok(Project {
        id: row.get(0)?,
        name: row.get(1)?,
        color_tag: row.get(2)?,
        status: row.get(3)?,
        created_at: row.get(4)?,
        updated_at: row.get(5)?,
    })
}
