import type {
  WorkspaceFile,
  WorkspaceProject,
  WorkspaceState,
} from "../types";

export class WorkspaceStore {
  private state: WorkspaceState = {
    project: undefined,
    activeFile: undefined,
    openFiles: [],
    selectedText: "",
    activeTerminal: undefined,
    gitBranch: undefined,
  };

  getState(): WorkspaceState {
    return this.state;
  }

  setProject(
    project: WorkspaceProject
  ): void {
    this.state.project = project;
  }

  setActiveFile(
  file: WorkspaceFile
): void {
    this.state.activeFile = file;
  }

  setOpenFiles(
    files: WorkspaceFile[]
  ): void {
    this.state.openFiles = files;
  }

  setSelectedText(
    text: string
  ): void {
    this.state.selectedText = text;
  }

  setGitBranch(
    branch: string
  ): void {
    this.state.gitBranch = branch;
  }

  reset(): void {
    this.state = {
      project: undefined,
      activeFile: undefined,
      openFiles: [],
      selectedText: "",
      activeTerminal: undefined,
      gitBranch: undefined,
    };
  }
}