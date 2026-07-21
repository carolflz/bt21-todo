import { create } from "zustand";
import { api } from "../api/client";
import { toErrorMessage } from "../api/errors";
import type { Meeting, MeetingWithDetails, SaveMeetingInput } from "../api/types";

interface MeetingsState {
  meetingsByProject: Record<string, Meeting[]>;
  activeMeeting: MeetingWithDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchMeetings: (projectId: string) => Promise<void>;
  loadMeeting: (id: string) => Promise<void>;
  saveMeeting: (projectId: string, input: SaveMeetingInput) => Promise<MeetingWithDetails>;
  deleteMeeting: (projectId: string, id: string) => Promise<void>;
  setActionItemDone: (id: string, isDone: boolean) => Promise<void>;
}

export const useMeetingsStore = create<MeetingsState>((set, get) => ({
  meetingsByProject: {},
  activeMeeting: null,
  isLoading: false,
  error: null,

  fetchMeetings: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const meetings = await api.meetings.list(projectId);
      set({
        meetingsByProject: { ...get().meetingsByProject, [projectId]: meetings },
        isLoading: false,
      });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
    }
  },

  loadMeeting: async (id) => {
    const meeting = await api.meetings.get(id);
    set({ activeMeeting: meeting });
  },

  saveMeeting: async (projectId, input) => {
    const meeting = await api.meetings.save(input);
    const existing = get().meetingsByProject[projectId] ?? [];
    const withoutSaved = existing.filter((m) => m.id !== meeting.id);
    set({
      meetingsByProject: { ...get().meetingsByProject, [projectId]: [...withoutSaved, meeting] },
      activeMeeting: meeting,
    });
    return meeting;
  },

  deleteMeeting: async (projectId, id) => {
    await api.meetings.delete(id);
    const existing = get().meetingsByProject[projectId] ?? [];
    set({
      meetingsByProject: {
        ...get().meetingsByProject,
        [projectId]: existing.filter((m) => m.id !== id),
      },
    });
  },

  setActionItemDone: async (id, isDone) => {
    await api.meetings.setActionItemDone(id, isDone);
    const active = get().activeMeeting;
    if (active) {
      set({
        activeMeeting: {
          ...active,
          actionItems: active.actionItems.map((item) =>
            item.id === id ? { ...item, isDone } : item
          ),
        },
      });
    }
  },
}));
