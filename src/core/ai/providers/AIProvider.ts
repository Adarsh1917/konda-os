import type {
  AIMessage,
  AIModel,
} from "../types";

export interface AIProvider {
  readonly id: string;

  chat(
    messages: AIMessage[]
  ): Promise<AIMessage>;

  listModels(): Promise<AIModel[]>;

  isAvailable(): Promise<boolean>;
}