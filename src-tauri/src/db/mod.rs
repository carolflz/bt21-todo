pub mod connection;
pub mod migrations;
pub mod models;

/// MVP has exactly one workspace; it is seeded by migration 0001_init.sql.
pub const DEFAULT_WORKSPACE_ID: &str = "default-workspace";
