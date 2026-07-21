use rusqlite::{params, Connection, Row};
use uuid::Uuid;

use crate::db::models::{ActionItem, Attendee, Meeting, MeetingWithDetails, SaveMeetingInput};
use crate::error::AppResult;

pub fn save_meeting_with_action_items(
    conn: &mut Connection,
    input: &SaveMeetingInput,
) -> AppResult<MeetingWithDetails> {
    let tx = conn.transaction()?;

    tx.execute(
        "INSERT INTO meetings (id, project_id, title, meeting_date, agenda, discussion)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           meeting_date = excluded.meeting_date,
           agenda = excluded.agenda,
           discussion = excluded.discussion,
           updated_at = datetime('now')",
        params![
            input.id,
            input.project_id,
            input.title,
            input.meeting_date,
            input.agenda,
            input.discussion
        ],
    )?;

    tx.execute("DELETE FROM attendees WHERE meeting_id = ?1", params![input.id])?;
    for attendee in &input.attendees {
        tx.execute(
            "INSERT INTO attendees (id, meeting_id, name, email) VALUES (?1, ?2, ?3, ?4)",
            params![Uuid::new_v4().to_string(), input.id, attendee.name, attendee.email],
        )?;
    }

    tx.execute("DELETE FROM action_items WHERE meeting_id = ?1", params![input.id])?;
    for item in &input.action_items {
        tx.execute(
            "INSERT INTO action_items (id, meeting_id, description, owner, due_date) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![Uuid::new_v4().to_string(), input.id, item.description, item.owner, item.due_date],
        )?;
    }

    tx.execute("DELETE FROM meeting_notes WHERE meeting_id = ?1", params![input.id])?;
    for note_id in &input.linked_note_ids {
        tx.execute(
            "INSERT INTO meeting_notes (meeting_id, note_id) VALUES (?1, ?2)",
            params![input.id, note_id],
        )?;
    }

    tx.commit()?;

    get_meeting_with_details(conn, &input.id)
}

pub fn get_meeting_with_details(conn: &Connection, id: &str) -> AppResult<MeetingWithDetails> {
    let meeting = conn.query_row(
        "SELECT id, project_id, title, meeting_date, agenda, discussion, created_at, updated_at
         FROM meetings WHERE id = ?1",
        params![id],
        map_meeting_row,
    )?;

    let mut attendee_stmt =
        conn.prepare("SELECT id, meeting_id, name, email FROM attendees WHERE meeting_id = ?1")?;
    let attendees = attendee_stmt
        .query_map(params![id], map_attendee_row)?
        .collect::<Result<Vec<_>, _>>()?;

    let mut action_item_stmt = conn.prepare(
        "SELECT id, meeting_id, description, owner, due_date, is_done, created_at
         FROM action_items WHERE meeting_id = ?1 ORDER BY due_date",
    )?;
    let action_items = action_item_stmt
        .query_map(params![id], map_action_item_row)?
        .collect::<Result<Vec<_>, _>>()?;

    let mut note_stmt = conn.prepare("SELECT note_id FROM meeting_notes WHERE meeting_id = ?1")?;
    let linked_note_ids = note_stmt
        .query_map(params![id], |row| row.get::<_, String>(0))?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(MeetingWithDetails {
        meeting,
        attendees,
        action_items,
        linked_note_ids,
    })
}

pub fn list_meetings_for_project(conn: &Connection, project_id: &str) -> AppResult<Vec<Meeting>> {
    let mut stmt = conn.prepare(
        "SELECT id, project_id, title, meeting_date, agenda, discussion, created_at, updated_at
         FROM meetings WHERE project_id = ?1 ORDER BY meeting_date DESC",
    )?;
    let rows = stmt
        .query_map(params![project_id], map_meeting_row)?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

pub fn delete_meeting(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM meetings WHERE id = ?1", params![id])?;
    Ok(())
}

fn map_meeting_row(row: &Row) -> rusqlite::Result<Meeting> {
    Ok(Meeting {
        id: row.get(0)?,
        project_id: row.get(1)?,
        title: row.get(2)?,
        meeting_date: row.get(3)?,
        agenda: row.get(4)?,
        discussion: row.get(5)?,
        created_at: row.get(6)?,
        updated_at: row.get(7)?,
    })
}

fn map_attendee_row(row: &Row) -> rusqlite::Result<Attendee> {
    Ok(Attendee {
        id: row.get(0)?,
        meeting_id: row.get(1)?,
        name: row.get(2)?,
        email: row.get(3)?,
    })
}

fn map_action_item_row(row: &Row) -> rusqlite::Result<ActionItem> {
    Ok(ActionItem {
        id: row.get(0)?,
        meeting_id: row.get(1)?,
        description: row.get(2)?,
        owner: row.get(3)?,
        due_date: row.get(4)?,
        is_done: row.get(5)?,
        created_at: row.get(6)?,
    })
}
