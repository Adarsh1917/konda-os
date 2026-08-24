import type { Project } from "../types/Project.types";
import { useProjectStore } from "../store/ProjectStore";

export function useProject() {
  const currentProject = useProjectStore(
    (state) => state.project
  );
  const setProject = useProjectStore(
    (state) => state.setProject
  );

  function openProject(
    project: Project
  ) {
    setProject(project);
  }

  return {
    currentProject,

    openProject,
  };
}
