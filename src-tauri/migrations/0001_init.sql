CREATE TABLE workspace (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL DEFAULT 'My Workspace',
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO workspace (id, name) VALUES ('default-workspace', 'My Workspace');

CREATE TABLE projects (
    id            TEXT PRIMARY KEY,
    workspace_id  TEXT NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    color_tag     TEXT NOT NULL DEFAULT '#FFD6E8',
    status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_status    ON projects(status);

CREATE TABLE notes (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL DEFAULT '',
    body        TEXT NOT NULL DEFAULT '',
    color       TEXT NOT NULL DEFAULT '#FFF6B7',
    pos_x       REAL NOT NULL DEFAULT 0,
    pos_y       REAL NOT NULL DEFAULT 0,
    width       REAL NOT NULL DEFAULT 220,
    height      REAL NOT NULL DEFAULT 220,
    pinned      INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0,1)),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_notes_pinned  ON notes(pinned);

CREATE TABLE meetings (
    id            TEXT PRIMARY KEY,
    project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    meeting_date  TEXT NOT NULL,
    agenda        TEXT NOT NULL DEFAULT '',
    discussion    TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_meetings_project ON meetings(project_id);
CREATE INDEX idx_meetings_date    ON meetings(meeting_date);

CREATE TABLE attendees (
    id          TEXT PRIMARY KEY,
    meeting_id  TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    email       TEXT
);
CREATE INDEX idx_attendees_meeting ON attendees(meeting_id);

CREATE TABLE action_items (
    id           TEXT PRIMARY KEY,
    meeting_id   TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    description  TEXT NOT NULL,
    owner        TEXT,
    due_date     TEXT,
    is_done      INTEGER NOT NULL DEFAULT 0 CHECK (is_done IN (0,1)),
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_action_items_due     ON action_items(due_date);

CREATE TABLE meeting_notes (
    meeting_id  TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    note_id     TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    PRIMARY KEY (meeting_id, note_id)
);
CREATE INDEX idx_meeting_notes_note ON meeting_notes(note_id);
