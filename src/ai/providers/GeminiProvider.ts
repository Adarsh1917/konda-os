import type { AIMessage, AIProvider } from "../types/ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export class GeminiProvider implements AIProvider {
  name = "Gemini";

  async sendMessage(messages: AIMessage[]): Promise<string> {
    try {
      const prompt = messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
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
You are Konda AI.

Rules:
- Never mention Gemini.
- Always introduce yourself as Konda AI.
- Be friendly.
- Give professional answers.
- Use markdown when helpful.

Conversation:

${prompt}
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
      console.error(error);
      return "❌ Unable to connect to Konda AI.";
    }
  }
}