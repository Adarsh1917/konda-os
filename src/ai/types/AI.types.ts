export type AIProvider =
  | "ollama"
  | "openai"
  | "lmstudio"
  | "future";

export interface AIModel {
  id: string;

  name: string;

  provider: AIProvider;

  description: string;

  capabilities: AICapability[];

  installed: boolean;

  enabled: boolean;

  contextWindow: number;
}

export type AICapability =
  | "chat"
  | "code"
  | "vision"
  | "reasoning"
  | "math"
  | "planning"
  | "search";

export interface AIMessage {
  id: string;

  role: "system" | "user" | "assistant";

  content: string;

  createdAt: number;
}

export interface ChatSession {
  id: string;

  title: string;

  model: string;

  messages: AIMessage[];
}

export interface AIRequest {
  prompt: string;

  model?: string;

  systemPrompt?: string;
}

export interface AIResponse {
  success: boolean;

  content: string;

  model: string;

  duration: number;
}