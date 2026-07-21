use rusqlite::{params, Connection};

use crate::error::AppResult;

pub fn set_action_item_done(conn: &Connection, id: &str, is_done: bool) -> AppResult<()> {
    conn.execute(
        "UPDATE action_items SET is_done = ?1 WHERE id = ?2",
        params![is_done, id],
    )?;
    Ok(())
}
