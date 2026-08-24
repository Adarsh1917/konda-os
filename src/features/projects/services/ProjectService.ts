import type { Project } from "../types/Project.types";

let currentProject: Project | null = null;

export function getCurrentProject() {
  return currentProject;
}

export function setCurrentProject(
  project: Project
) {
  currentProject = project;
}