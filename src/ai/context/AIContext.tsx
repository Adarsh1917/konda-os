import {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AIManager } from "../AIManager";
import { GeminiProvider, LocalProvider } from "../providers";

type ModelType = "gemini" | "local";

interface AIContextType {
  aiManager: AIManager;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
}

export const AIContext = createContext<AIContextType | null>(null);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [selectedModel, setSelectedModel] =
    useState<ModelType>("gemini");

  const aiManager = useMemo(() => {
    if (selectedModel === "local") {
      return new AIManager(new LocalProvider());
    }

    return new AIManager(new GeminiProvider());
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