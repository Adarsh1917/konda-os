import { create } from "zustand";

import type {
  AIMessage,
} from "../types/AI.types";

interface AIState {
  loading: boolean;

  activeModel: string;

  messages: AIMessage[];

  setLoading(
    loading: boolean
  ): void;

  setActiveModel(
    model: string
  ): void;

  addMessage(
    message: AIMessage
  ): void;

  clearMessages(): void;
}

export const useAIStore =
  create<AIState>((set) => ({
    loading: false,

    activeModel: "odysseus",

    messages: [],

    setLoading: (loading) =>
      set({ loading }),

    setActiveModel: (
      activeModel
    ) =>
      set({
        activeModel,
      }),

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    clearMessages: () =>
      set({
        messages: [],
      }),
  }));