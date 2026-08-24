import { create } from "zustand";

export interface ProjectInfo {
  name: string;
  path: string;
}

interface ProjectStore {
  project: ProjectInfo | null;

  setProject: (
    project: ProjectInfo
  ) => void;

  clearProject: () => void;
}

export const useProjectStore =
  create<ProjectStore>((set) => ({
    project: null,

    setProject: (project) =>
      set({
        project,
      }),

    clearProject: () =>
      set({
        project: null,
      }),
  }));