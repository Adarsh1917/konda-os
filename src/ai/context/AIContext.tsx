import {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AIManager } from "../AIManager";
import {
  GeminiProvider,
  OllamaProvider,
} from "../providers";

type ModelType = "gemini" | "ollama";

interface AIContextType {
  aiManager: AIManager;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
}

export const AIContext = createContext<AIContextType | null>(null);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({
  children,
}: AIProviderProps) {
  const [selectedModel, setSelectedModel] =
    useState<ModelType>("ollama");

  const aiManager = useMemo(() => {
    switch (selectedModel) {
      case "ollama":
        return new AIManager(
          new OllamaProvider()
        );

      case "gemini":
      default:
        return new AIManager(
          new GeminiProvider()
        );
    }
  }, [selectedModel]);

  return (
    <AIContext.Provider
      value={{
        aiManager,
        selectedModel,
        setSelectedModel,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export default AIProvider;