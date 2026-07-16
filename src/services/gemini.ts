const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(message: string) {
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
                text: `
You are Konda AI.

Rules:
- Never mention Gemini.
- Always introduce yourself as Konda AI.
- Be friendly and helpful.

User:
${message}
`,
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

export async function generateChatTitle(message: string) {
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
                text: `
Generate a short chat title (maximum 4 words).

Do not use quotes.
Do not use punctuation.
Return only the title.

Message:
${message}
`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
    "New Chat"
  );
}