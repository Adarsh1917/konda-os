export const WorkspaceEvents = {
  PROJECT_OPENED: "workspace.project.opened",

  PROJECT_CLOSED: "workspace.project.closed",

  FILE_OPENED: "workspace.file.opened",

  FILE_CLOSED: "workspace.file.closed",

  ACTIVE_FILE_CHANGED:
    "workspace.activeFile.changed",

  SELECTION_CHANGED:
    "workspace.selection.changed",

  GIT_BRANCH_CHANGED:
    "workspace.git.changed",
} as const;

export type WorkspaceEvent =
  (typeof WorkspaceEvents)[keyof typeof WorkspaceEvents];