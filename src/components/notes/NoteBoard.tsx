import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNotesStore } from "../../stores/notesStore";
import { StickyNote } from "./StickyNote";
import { Button } from "../common/Button";
import { NOTE_COLORS } from "./ColorPicker";
import { DailyQuote } from "./DailyQuote";
import styles from "./NoteBoard.module.css";

interface NoteBoardProps {
  projectId: string;
}

export function NoteBoard({ projectId }: NoteBoardProps) {
  const { notesByProject, fetchNotes, createNote, updateNote, deleteNote } = useNotesStore();
  const notes = notesByProject[projectId] ?? [];

  useEffect(() => {
    fetchNotes(projectId);
  }, [projectId, fetchNotes]);

  async function handleAddNote() {
    const posX = 40 + Math.random() * 200;
    const posY = 40 + Math.random() * 120;
    const color = NOTE_COLORS[notes.length % NOTE_COLORS.length];
    await createNote(projectId, posX, posY, color);
  }

  return (
    <div className={styles.board}>
      <div className={styles.toolbar}>
        <Button variant="primary" onClick={handleAddNote} className={styles.newNoteBtn}>
          + New Note
        </Button>
        <DailyQuote />
      </div>
      <div className={styles.canvas}>
        <AnimatePresence>
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={(input) => updateNote(projectId, note.id, input)}
              onDelete={() => deleteNote(projectId, note.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
