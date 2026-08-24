import type { AIModel } from "./Model.types";

export const DefaultModels: AIModel[] = [
  {
    id: "qwen3",

    name: "Qwen 3",

    provider: "ollama",

    capabilities: [
      "chat",
      "coding",
      "reasoning"
    ],

    contextWindow: 32768,

    installed: false,

    enabled: true,
  },

  {
    id: "llama3.1",

    name: "Llama 3.1",

    provider: "ollama",

    capabilities: [
      "chat",
      "reasoning"
    ],

    contextWindow: 32768,

    installed: false,

    enabled: true,
  },

  {
    id: "deepseek-r1",

    name: "DeepSeek R1",

    provider: "ollama",

    capabilities: [
      "reasoning",
      "coding"
    ],

    contextWindow: 32768,

    installed: false,

    enabled: true,
  },
];