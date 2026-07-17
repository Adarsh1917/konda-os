import { useState } from "react";
import type { Chat as ChatType } from "../../types/chat";
import { askGemini, generateChatTitle } from "../../services/gemini";

import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import "./Chat.css";

interface ChatProps {
  chat: ChatType;
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

function Chat({ chat, setChats }: ChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    const userText = input.trim();

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      text: userText,
    };

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
    <main className="chat-workspace">
      {chat.messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <MessageList messages={chat.messages} />
      )}

      {loading && <TypingIndicator />}

      <ChatInput
        input={input}
        loading={loading}
        onInputChange={setInput}
        onSend={sendMessage}
      />
    </main>
  );
}

export default Chat;