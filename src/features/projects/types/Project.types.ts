export interface Project {
  name: string;
  path: string;
}

export interface ProjectState {
  currentProject: Project | null;

  openProject(
    project: Project
  ): void;
}