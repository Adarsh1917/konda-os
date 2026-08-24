import {
  MODEL_REGISTRY,
} from "./ModelRegistry";

export class ModelManager {
  getAllModels() {
    return MODEL_REGISTRY;
  }

  getModel(id: string) {
    return MODEL_REGISTRY.find(
      (model) => model.id === id
    );
  }

  getInstalledModels() {
    return MODEL_REGISTRY.filter(
      (model) => model.installed
    );
  }

  getEnabledModels() {
    return MODEL_REGISTRY.filter(
      (model) => model.enabled
    );
  }
}

export const modelManager =
  new ModelManager();