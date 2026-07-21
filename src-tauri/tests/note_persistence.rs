use todo_app_lib::db::{connection, migrations};
use todo_app_lib::repository::{notes_repo, projects_repo};

fn unique_db_path() -> std::path::PathBuf {
    let mut path = std::env::temp_dir();
    path.push(format!("todo_app_test_{}.sqlite3", uuid::Uuid::new_v4()));
    path
}

#[test]
fn notes_retain_position_size_color_across_restart_and_archive() {
    let db_path = unique_db_path();

    // "First launch": create a project, add notes exactly as the create_note
    // command does (empty title/body, client-picked color), then drag/resize/
    // recolor them via update_note, then archive the project.
    {
        let pool = connection::init_pool(db_path.clone());
        let mut conn = pool.get().expect("get conn");
        migrations::run_migrations(&mut conn);

        let project = projects_repo::create_project(&conn, "proj-1", "Test Project", "#7C6FEF")
            .expect("create project");

        let note_a = notes_repo::create_note(&conn, "note-a", &project.id, "", "", "#FFF6B7", 40.0, 40.0)
            .expect("create note a");
        let note_b = notes_repo::create_note(&conn, "note-b", &project.id, "", "", "#FFD6E8", 100.0, 60.0)
            .expect("create note b");

        // simulate drag/resize/recolor (drag-end / resize-end persistence)
        notes_repo::update_note(&conn, &note_a.id, "Groceries", "Milk, eggs", "#CFE8FF", 220.5, 340.25, 260.0, 300.0, true)
            .expect("update note a");
        notes_repo::update_note(&conn, &note_b.id, "", "", "#D3F5DF", 500.0, 15.0, 180.0, 180.0, false)
            .expect("update note b");

        projects_repo::set_project_status(&conn, &project.id, "archived").expect("archive project");
    }
    // pool and connection dropped here -- simulates the app process exiting.

    // "Restart": brand new pool opened against the same database file on disk.
    {
        let pool = connection::init_pool(db_path.clone());
        let conn = pool.get().expect("get conn");

        let projects = projects_repo::list_projects(&conn, None).expect("list projects");
        assert_eq!(projects.len(), 1);
        assert_eq!(projects[0].status, "archived");

        let notes = notes_repo::list_notes_for_project(&conn, "proj-1").expect("list notes");
        assert_eq!(notes.len(), 2);

        let note_a = notes.iter().find(|n| n.id == "note-a").expect("note a present");
        assert_eq!(note_a.title, "Groceries");
        assert_eq!(note_a.color, "#CFE8FF");
        assert_eq!(note_a.pos_x, 220.5);
        assert_eq!(note_a.pos_y, 340.25);
        assert_eq!(note_a.width, 260.0);
        assert_eq!(note_a.height, 300.0);
        assert!(note_a.pinned);

        let note_b = notes.iter().find(|n| n.id == "note-b").expect("note b present");
        assert_eq!(note_b.color, "#D3F5DF");
        assert_eq!(note_b.pos_x, 500.0);
        assert_eq!(note_b.pos_y, 15.0);
        assert!(!note_b.pinned);
    }

    let _ = std::fs::remove_file(&db_path);
}
