import { describe, expect, it, vi } from "vitest";

import { AIService } from "../services/AIService";

const unusedServiceMethods = {
  getSelectedModel: () => "default-model",
  getHealth: async () => ({ status: "healthy" as const, timestamp: Date.now() }),
  listModels: async () => [],
};

describe("chat integration", () => {
  it("sends the chat prompt through the gateway-backed service and maps its response", async () => {
    const generate = vi.fn().mockResolvedValue({
      text: "Hello from Konda",
      model: "router-model",
      provider: "groq",
      duration: 12,
    });
    const service = new AIService({ ...unusedServiceMethods, generate });

    await expect(service.ask({ prompt: "Hello Konda", model: "requested-model" })).resolves.toEqual({
      success: true,
      content: "Hello from Konda",
      model: "router-model",
      duration: 12,
    });
    expect(generate).toHaveBeenCalledWith({
      prompt: "Hello Konda",
      model: "requested-model",
    });
  });

  it("returns a safe user-facing error without exposing provider secrets", async () => {
    const service = new AIService({
      ...unusedServiceMethods,
      generate: vi.fn().mockRejectedValue(new Error("provider apiKey=private-secret")),
    });

    await expect(service.ask({ prompt: "Hello Konda", model: "requested-model" })).resolves.toEqual({
      success: false,
      content: "Unable to reach the configured AI service. Please try again.",
      model: "requested-model",
      duration: 0,
    });
  });
});
