use crate::db::connection::DbPool;

pub struct AppState {
    pub pool: DbPool,
}
