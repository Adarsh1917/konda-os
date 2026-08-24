export interface WorkspaceFile {
  id: string;

  name: string;

  path: string;

  content: string;

  language?: string;

  modified: boolean;
}

export interface WorkspaceContextState {
  files: WorkspaceFile[];

  activeFileId: string | null;

  savingFileId: string | null;

  error: string | null;

  openFile(file: WorkspaceFile): void;

  closeFile(id: string): void;

  setActiveFile(id: string | null): void;

  updateFileContent(
    id: string,
    content: string
  ): void;

  saveFile(id: string): Promise<void>;
}

export interface WorkspaceProject {
  id: string;

  name: string;

  root: string;
}

export interface WorkspaceState {
  project?: WorkspaceProject;

  activeFile?: WorkspaceFile;

  openFiles: WorkspaceFile[];

  selectedText: string;

  activeTerminal?: string;

  gitBranch?: string;
}
