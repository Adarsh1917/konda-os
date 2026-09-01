import { create } from "zustand";

import type {
  AIMessage,
} from "../types/AI.types";

export type AIRequestStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";

interface AIState {
  loading: boolean;
  status: AIRequestStatus;
  error: string | null;
  activeModel: string;
  messages: AIMessage[];

  setLoading(loading: boolean): void;
  setStatus(status: AIRequestStatus): void;
  setError(error: string | null): void;
  setActiveModel(model: string): void;
  addMessage(message: AIMessage): void;
  clearMessages(): void;
  clearError(): void;
}

export const useAIStore =
  create<AIState>((set) => ({
    loading: false,
    status: "idle",
    error: null,
    activeModel: "odysseus",
    messages: [],

    setLoading: (loading) =>
      set({ loading }),

    setStatus: (status) =>
      set({ status }),

    setError: (error) =>
      set({ error }),

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

    clearError: () => set({ error: null }),
  }));