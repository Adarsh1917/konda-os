import { useMemo, useState } from "react";

import { AIService } from "../../ai";

export function useAI() {
  const [selectedModel, setSelectedModel] =
    useState("qwen2.5-coder:7b");

  const aiManager = useMemo(
    () => ({
      async sendMessage(prompt: string) {
        return AIService.ask(prompt);
      },
    }),
    []
  );

  return {
    aiManager,
    selectedModel,
    setSelectedModel,
  };
}