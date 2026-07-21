import { create } from "zustand";
import { api } from "../api/client";
import { toErrorMessage } from "../api/errors";
import type { Project } from "../api/types";

interface ProjectsState {
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, colorTag: string) => Promise<Project>;
  renameProject: (id: string, name: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  unarchiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (id: string | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await api.projects.list();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
    }
  },

  createProject: async (name, colorTag) => {
    const project = await api.projects.create(name, colorTag);
    set({ projects: [...get().projects, project] });
    return project;
  },

  renameProject: async (id, name) => {
    const project = await api.projects.rename(id, name);
    set({ projects: get().projects.map((p) => (p.id === id ? project : p)) });
  },

  archiveProject: async (id) => {
    const project = await api.projects.archive(id);
    set({ projects: get().projects.map((p) => (p.id === id ? project : p)) });
  },

  unarchiveProject: async (id) => {
    const project = await api.projects.unarchive(id);
    set({ projects: get().projects.map((p) => (p.id === id ? project : p)) });
  },

  deleteProject: async (id) => {
    await api.projects.delete(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
    if (get().activeProjectId === id) {
      set({ activeProjectId: null });
    }
  },

  setActiveProject: (id) => set({ activeProjectId: id }),
}));
