import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { FileNode } from "../types";

export interface OpenTab {
  id: string;
  name: string;
}

export interface WorkspaceContextType {
  project: FileNode[];
  setProject: React.Dispatch<
    React.SetStateAction<FileNode[]>
  >;

  activeFile: FileNode | null;
  setActiveFile: React.Dispatch<
    React.SetStateAction<FileNode | null>
  >;

  activeTabId: string | null;
  setActiveTabId: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  openTabs: OpenTab[];
  setOpenTabs: React.Dispatch<
    React.SetStateAction<OpenTab[]>
  >;

  showDialog: boolean;
  setShowDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const WorkspaceContext =
  createContext<WorkspaceContextType | null>(
    null
  );

interface Props {
  value: WorkspaceContextType;
  children: ReactNode;
}

export function WorkspaceProvider({
  value,
  children,
}: Props) {
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(
    WorkspaceContext
  );

  if (!context) {
    throw new Error(
      "useWorkspaceContext must be used inside WorkspaceProvider."
    );
  }

  return context;
}