export type ExplorerItemType = "file" | "folder";

export interface ExplorerItem {
  id: string;
  name: string;
  type: ExplorerItemType;

  // null = root folder
  parentId: string | null;

  // File only
  content?: string;

  // Folder only
  isExpanded?: boolean;
}