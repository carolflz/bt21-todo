import { create } from "zustand";
import { api } from "../api/client";
import { toErrorMessage } from "../api/errors";
import type { Note, UpdateNoteInput } from "../api/types";

interface NotesState {
  notesByProject: Record<string, Note[]>;
  isLoading: boolean;
  error: string | null;
  fetchNotes: (projectId: string) => Promise<void>;
  createNote: (projectId: string, posX: number, posY: number, color: string) => Promise<Note>;
  updateNote: (projectId: string, id: string, input: UpdateNoteInput) => Promise<void>;
  deleteNote: (projectId: string, id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notesByProject: {},
  isLoading: false,
  error: null,

  fetchNotes: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const notes = await api.notes.list(projectId);
      set({ notesByProject: { ...get().notesByProject, [projectId]: notes }, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
    }
  },

  createNote: async (projectId, posX, posY, color) => {
    const note = await api.notes.create(projectId, posX, posY, color);
    const existing = get().notesByProject[projectId] ?? [];
    set({
      notesByProject: { ...get().notesByProject, [projectId]: [...existing, note] },
    });
    return note;
  },

  updateNote: async (projectId, id, input) => {
    const note = await api.notes.update(id, input);
    const existing = get().notesByProject[projectId] ?? [];
    set({
      notesByProject: {
        ...get().notesByProject,
        [projectId]: existing.map((n) => (n.id === id ? note : n)),
      },
    });
  },

  deleteNote: async (projectId, id) => {
    await api.notes.delete(id);
    const existing = get().notesByProject[projectId] ?? [];
    set({
      notesByProject: {
        ...get().notesByProject,
        [projectId]: existing.filter((n) => n.id !== id),
      },
    });
  },
}));
