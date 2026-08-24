import { ai } from "../services/AIService";
import { chooseModel } from "../router/AIRouter";
import { useAIStore } from "../store/AIStore";

export function useAI() {
  const store = useAIStore();

  async function ask(
    prompt: string
  ) {
    store.setLoading(true);

    const model =
      chooseModel({
        prompt,
      });

    store.setActiveModel(
      model
    );

    store.addMessage({
      id: crypto.randomUUID(),

      role: "user",

      content: prompt,

      createdAt: Date.now(),
    });

    try {
      const response =
        await ai.ask({
          prompt,
          model,
        });

      store.addMessage({
        id: crypto.randomUUID(),

        role: "assistant",

        content:
          response.content,

        createdAt: Date.now(),
      });

      return response;
    } finally {
      store.setLoading(false);
    }
  }

  return {
    ...store,

    ask,
  };
}
