export type ExplorerItemType = "folder" | "file";

export interface ExplorerNode {
  id: string;
  name: string;
  type: ExplorerItemType;
  path: string;
  expanded?: boolean;
  children?: ExplorerNode[];
}

export interface ExplorerContextState {
  tree: ExplorerNode[];
  selected: string | null;
  rootPath: string | null;
  isLoading: boolean;
  error: string | null;

  selectNode: (id: string) => void;
  toggleFolder: (id: string) => Promise<void>;
  openProject: () => Promise<void>;
  refresh: () => Promise<void>;
  reportError: (message: string | null) => void;
}
