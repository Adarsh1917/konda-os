export interface AIContext {
  projectId?: string;

  workspaceId?: string;

  conversationId?: string;

  activeFile?: string;

  selectedText?: string;

  openFiles: string[];

  metadata: Record<string, unknown>;
}