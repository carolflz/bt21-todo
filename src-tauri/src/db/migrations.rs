use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};

pub fn migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(include_str!("../../migrations/0001_init.sql")),
        M::up(include_str!("../../migrations/0002_settings_table.sql")),
    ])
}

pub fn run_migrations(conn: &mut Connection) {
    migrations()
        .to_latest(conn)
        .expect("failed to run database migrations");
}
