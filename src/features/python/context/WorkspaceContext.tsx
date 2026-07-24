import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { FileNode } from "../types";

export interface OpenTab {
  id: string;
  name: string;
}

export interface WorkspaceContextType {
  /* ==========================
     State
  ========================== */

  project: FileNode[];
  setProject: Dispatch<
    SetStateAction<FileNode[]>
  >;

  activeFile: FileNode | null;
  setActiveFile: Dispatch<
    SetStateAction<FileNode | null>
  >;

  activeTabId: string | null;
  setActiveTabId: Dispatch<
    SetStateAction<string | null>
  >;

  openTabs: OpenTab[];
  setOpenTabs: Dispatch<
    SetStateAction<OpenTab[]>
  >;

  showDialog: boolean;
  setShowDialog: Dispatch<
    SetStateAction<boolean>
  >;

  /* ==========================
     Workspace Actions
  ========================== */

  updateActiveFile: (
    content: string
  ) => void;

  openFile: (
    file: FileNode
  ) => void;

  selectTab: (
    id: string
  ) => void;

  closeTab: (
    id: string
  ) => void;

  createFolder: (
    parentId: string,
    folderName: string
  ) => void;

  createFile: (
    parentId: string,
    fileName: string
  ) => void;

  renameItem: (
    id: string,
    newName: string
  ) => void;

  deleteItem: (
    id: string
  ) => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextType | null>(
    null
  );

interface WorkspaceProviderProps {
  value: WorkspaceContextType;
  children: ReactNode;
}

export function WorkspaceProvider({
  value,
  children,
}: WorkspaceProviderProps) {
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context =
    useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspaceContext must be used inside WorkspaceProvider."
    );
  }

  return context;
}

export default WorkspaceContext;