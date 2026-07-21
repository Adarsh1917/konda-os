import type { AIMessage, AIProvider } from "../types/ai";
import { systemPrompt } from "../prompts";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export class GeminiProvider implements AIProvider {
  name = "Gemini";

  async sendMessage(messages: AIMessage[]): Promise<string> {
    try {
      const conversation = messages
        .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
        .join("\n\n");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
${systemPrompt}

Conversation:

${conversation}
`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I couldn't generate a response."
      );
    } catch (error) {
      console.error("GeminiProvider Error:", error);

      return "❌ Unable to connect to Konda AI.";
    }
  }
}