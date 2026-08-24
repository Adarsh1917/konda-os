export type ModelCapability =
  | "chat"
  | "coding"
  | "reasoning"
  | "vision"
  | "embedding"
  | "planning";

export interface AIModel {
  id: string;

  name: string;

  provider: string;

  capabilities: ModelCapability[];

  contextWindow: number;

  installed: boolean;

  enabled: boolean;
}