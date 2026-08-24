import type {
  AIModel,
} from "../types/AI.types";

export const MODEL_REGISTRY: AIModel[] = [
  {
    id: "odysseus",

    name: "Odysseus",

    provider: "ollama",

    description:
      "Primary conversation model",

    capabilities: [
      "chat",
      "planning",
    ],

    installed: false,

    enabled: true,

    contextWindow: 8192,
  },

  {
    id: "qwen-coder",

    name: "Qwen Coder",

    provider: "ollama",

    description:
      "Programming specialist",

    capabilities: [
      "code",
    ],

    installed: false,

    enabled: true,

    contextWindow: 32768,
  },

  {
    id: "deepseek-r1",

    name: "DeepSeek R1",

    provider: "ollama",

    description:
      "Reasoning specialist",

    capabilities: [
      "reasoning",
      "math",
    ],

    installed: false,

    enabled: true,

    contextWindow: 32768,
  },
];