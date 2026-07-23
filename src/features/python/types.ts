export type NodeType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;

  expanded?: boolean;

  content?: string;

  children?: FileNode[];
}