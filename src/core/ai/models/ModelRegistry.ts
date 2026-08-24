import type { AIModel } from "./Model.types";

export class ModelRegistry {
  private readonly models =
    new Map<string, AIModel>();

  register(
    model: AIModel
  ): void {
    this.models.set(
      model.id,
      model
    );
  }

  unregister(
    id: string
  ): void {
    this.models.delete(id);
  }

  get(
    id: string
  ): AIModel | undefined {
    return this.models.get(id);
  }

  getAll(): AIModel[] {
    return Array.from(
      this.models.values()
    );
  }

  getInstalled(): AIModel[] {
    return this.getAll().filter(
      model => model.installed
    );
  }

  getEnabled(): AIModel[] {
    return this.getAll().filter(
      model => model.enabled
    );
  }
}