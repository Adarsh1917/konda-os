export type AIProviderType = "ollama";

export type AIMessageRole =
  | "system"
  | "user"
  | "assistant";

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface ChatRequest {
  messages: AIMessage[];
}

export interface ChatResponse {
  message: AIMessage;
}

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderType;
  installed?: boolean;
}

export interface AIProviderInfo {
  id: AIProviderType;
  displayName: string;
}

export interface AIProviderConfig {
  provider: AIProviderType;
  model: string;
}