use std::path::PathBuf;

use r2d2::{CustomizeConnection, Pool};
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::Connection;

pub type DbPool = Pool<SqliteConnectionManager>;

#[derive(Debug)]
struct ForeignKeysCustomizer;

impl CustomizeConnection<Connection, rusqlite::Error> for ForeignKeysCustomizer {
    fn on_acquire(&self, conn: &mut Connection) -> Result<(), rusqlite::Error> {
        conn.execute_batch("PRAGMA foreign_keys = ON;")
    }
}

pub fn init_pool(db_path: PathBuf) -> DbPool {
    let manager = SqliteConnectionManager::file(db_path);
    Pool::builder()
        .connection_customizer(Box::new(ForeignKeysCustomizer))
        .build(manager)
        .expect("failed to create sqlite connection pool")
}
