import { useContext } from "react";
import { AIContext } from "../ai/context/AIContext";

export function useAI() {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error("useAI must be used inside an AIProvider");
  }

  return context;
}