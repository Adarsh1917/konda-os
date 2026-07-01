const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

type Message = {
  sender: "user" | "ai";
  text: string;
};

export async function askGemini(messages: Message[]) {
  const conversation = messages
    .map((msg) => `${msg.sender === "user" ? "User" : "Konda AI"}: ${msg.text}`)
    .join("\n");

  const prompt = `
You are Konda AI, the personal AI inside Konda OS.

Rules:
- You are Konda AI.
- Never say you are Google's AI unless directly asked about your underlying model.
- Be friendly, intelligent, and professional.
- Remember the conversation naturally.
- Answer clearly and helpfully.

Conversation:
${conversation}

Now continue the conversation as Konda AI.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't generate a response."
  );
}