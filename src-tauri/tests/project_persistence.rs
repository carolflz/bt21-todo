use todo_app_lib::db::{connection, migrations};
use todo_app_lib::repository::projects_repo;

fn unique_db_path() -> std::path::PathBuf {
    let mut path = std::env::temp_dir();
    path.push(format!("todo_app_test_{}.sqlite3", uuid::Uuid::new_v4()));
    path
}

#[test]
fn project_persists_across_pool_restart() {
    let db_path = unique_db_path();

    // "First launch": open pool, run migrations, create a project via the same
    // repository code path the create_project command uses.
    {
        let pool = connection::init_pool(db_path.clone());
        let mut conn = pool.get().expect("get conn");
        migrations::run_migrations(&mut conn);

        let project = projects_repo::create_project(&conn, "test-id-1", "Test Project", "#FFD6E8")
            .expect("create project");
        assert_eq!(project.name, "Test Project");
        assert_eq!(project.status, "active");
    }
    // pool and connection dropped here -- simulates the app process exiting.

    // "Restart": brand new pool opened against the same database file on disk.
    {
        let pool = connection::init_pool(db_path.clone());
        let conn = pool.get().expect("get conn");
        let projects = projects_repo::list_projects(&conn, None).expect("list projects");
        assert_eq!(projects.len(), 1);
        assert_eq!(projects[0].name, "Test Project");
        assert_eq!(projects[0].status, "active");
    }

    let _ = std::fs::remove_file(&db_path);
}

#[test]
fn archive_and_delete_project_flow() {
    let db_path = unique_db_path();
    let pool = connection::init_pool(db_path.clone());
    let mut conn = pool.get().expect("get conn");
    migrations::run_migrations(&mut conn);

    projects_repo::create_project(&conn, "test-id-2", "Archivable Project", "#B7E4FF")
        .expect("create project");

    let archived = projects_repo::set_project_status(&conn, "test-id-2", "archived")
        .expect("archive project");
    assert_eq!(archived.status, "archived");

    let active_only = projects_repo::list_projects(&conn, Some("active")).expect("list active");
    assert!(active_only.iter().all(|p| p.id != "test-id-2"));

    projects_repo::delete_project(&conn, "test-id-2").expect("delete project");
    let all = projects_repo::list_projects(&conn, None).expect("list all");
    assert!(all.iter().all(|p| p.id != "test-id-2"));

    drop(conn);
    let _ = std::fs::remove_file(&db_path);
}
