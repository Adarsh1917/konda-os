import type { FileNode } from "../types";

interface OpenTab {
  id: string;
  name: string;
  dirty: boolean;
}

export interface WorkspaceState {
  project: FileNode[];
  openTabs: OpenTab[];
  activeTabId: string | null;
}

const STORAGE_KEY = "konda-workspace";

export function saveWorkspace(
  workspace: WorkspaceState
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(workspace)
  );
}

export function loadWorkspace(): WorkspaceState | null {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearWorkspace() {
  localStorage.removeItem(STORAGE_KEY);
}