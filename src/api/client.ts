import { invoke } from "@tauri-apps/api/core";
import type {
  Project,
  ProjectStatus,
  Note,
  UpdateNoteInput,
  Meeting,
  MeetingWithDetails,
  SaveMeetingInput,
} from "./types";

export const api = {
  projects: {
    create: (name: string, colorTag: string) =>
      invoke<Project>("create_project", { name, colorTag }),
    list: (status?: ProjectStatus) =>
      invoke<Project[]>("list_projects", { status: status ?? null }),
    rename: (id: string, name: string) => invoke<Project>("rename_project", { id, name }),
    archive: (id: string) => invoke<Project>("archive_project", { id }),
    unarchive: (id: string) => invoke<Project>("unarchive_project", { id }),
    delete: (id: string) => invoke<void>("delete_project", { id }),
  },
  notes: {
    create: (projectId: string, posX: number, posY: number, color: string) =>
      invoke<Note>("create_note", { projectId, posX, posY, color }),
    list: (projectId: string) => invoke<Note[]>("list_notes", { projectId }),
    update: (id: string, input: UpdateNoteInput) => invoke<Note>("update_note", { id, input }),
    delete: (id: string) => invoke<void>("delete_note", { id }),
  },
  meetings: {
    save: (input: SaveMeetingInput) => invoke<MeetingWithDetails>("save_meeting", { input }),
    get: (id: string) => invoke<MeetingWithDetails>("get_meeting", { id }),
    list: (projectId: string) => invoke<Meeting[]>("list_meetings", { projectId }),
    delete: (id: string) => invoke<void>("delete_meeting", { id }),
    setActionItemDone: (id: string, isDone: boolean) =>
      invoke<void>("set_action_item_done", { id, isDone }),
  },
};
