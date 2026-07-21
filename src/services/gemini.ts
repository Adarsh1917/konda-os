const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateChatTitle(
  message: string
): Promise<string> {
  try {
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
Generate a short title.

Rules:
- Maximum 4 words.
- No punctuation.
- No quotation marks.
- Return ONLY the title.

Message:
${message}
`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "New Chat"
    );
  } catch (error) {
    console.error(error);
    return "New Chat";
  }
}