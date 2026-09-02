import { ai } from "../services/AIService";
import { useAIStore } from "../store/AIStore";

export function useAI() {
  const store = useAIStore();

  async function ask(prompt: string) {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      const emptyError = "Please enter a message before sending.";
      store.setStatus("error");
      store.setError(emptyError);
      return {
        success: false,
        content: emptyError,
        model: store.activeModel,
        duration: 0,
      };
    }

    store.setLoading(true);
    store.setStatus("sending");
    store.setError(null);

    const model = store.activeModel;
    store.setActiveModel(model);
    store.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedPrompt,
      createdAt: Date.now(),
    });

    try {
      const response = await ai.ask({
        prompt: trimmedPrompt,
        model,
      });

      if (!response.success) {
        store.setStatus("error");
        store.setError(
          response.content ||
            "Unable to reach the selected AI provider. Check your provider configuration and try again.",
        );

        return response;
      }

      store.addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.content,
        createdAt: Date.now(),
      });

      store.setStatus("success");
      store.setError(null);
      return response;
    } catch {
      const message = "Unable to reach the configured AI service. Please try again.";

      store.setStatus("error");
      store.setError(message);
      return {
        success: false,
        content: message,
        model,
        duration: 0,
      };
    } finally {
      store.setLoading(false);
    }
  }

  return {
    ...store,
    ask,
  };
}
