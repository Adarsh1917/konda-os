import { useState, useEffect, useRef } from "react";
import type { Chat as ChatType } from "../../types/chat";
import { askGemini, generateChatTitle } from "../../services/gemini";

interface ChatProps {
  chat: ChatType;
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

function Chat({ chat, setChats }: ChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat.messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    const userText = input.trim();

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      text: userText,
    };

    // Add user message
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    );

    setInput("");

    // Generate title only once
    if (
      chat.title.startsWith("New Chat") &&
      chat.messages.length === 1
    ) {
      try {
        const title = await generateChatTitle(userText);

        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  title,
                }
              : c
          )
        );
      } catch (error) {
        console.error(error);
      }
    }

    try {
      const reply = await askGemini(userText);

      const aiMessage = {
        id: crypto.randomUUID(),
        sender: "ai" as const,
        text: reply,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
              }
            : c
        )
      );
    } catch (error) {
      console.error(error);

      const aiMessage = {
        id: crypto.randomUUID(),
        sender: "ai" as const,
        text: "❌ Sorry, I couldn't connect to Konda AI.",
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
              }
            : c
        )
      );
    }

    setLoading(false);
  };

  return (
    <main className="chat">
      <div className="messages">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="message ai">
            🤖 Konda AI is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          placeholder="Ask Konda AI..."
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </main>
  );
}

export default Chat;