export type FileType =
  | "file"
  | "folder"
  | "python"
  | "java"
  | "cpp"
  | "javascript"
  | "typescript"
  | "json"
  | "markdown"
  | "text";

export interface ExplorerNode {
  id: string;
  name: string;
  type: FileType;

  children?: ExplorerNode[];

  expanded?: boolean;
}