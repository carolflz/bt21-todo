export type ProjectStatus = "active" | "archived";

export interface Project {
  id: string;
  name: string;
  colorTag: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  body: string;
  color: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNoteInput {
  title: string;
  body: string;
  color: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  pinned: boolean;
}

export interface Attendee {
  id: string;
  meetingId: string;
  name: string;
  email: string | null;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  isDone: boolean;
  createdAt: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  meetingDate: string;
  agenda: string;
  discussion: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingWithDetails extends Meeting {
  attendees: Attendee[];
  actionItems: ActionItem[];
  linkedNoteIds: string[];
}

export interface AttendeeInput {
  name: string;
  email: string | null;
}

export interface ActionItemInput {
  description: string;
  owner: string | null;
  dueDate: string | null;
}

export interface SaveMeetingInput {
  id: string;
  projectId: string;
  title: string;
  meetingDate: string;
  agenda: string;
  discussion: string;
  attendees: AttendeeInput[];
  actionItems: ActionItemInput[];
  linkedNoteIds: string[];
}
