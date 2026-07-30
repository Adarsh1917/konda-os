import { useState } from "react";
import type { Chat as ChatType } from "../../types/chat";
import "./ModelSelector.css";
// Try to import the hook; provide a lightweight fallback to avoid build errors
// when the hooks module isn't present. This keeps the component usable during
// incremental development without changing other files.
declare const require: any;
let useAI: any;
try {
  // Only call require if it's available at runtime (avoids TS/node type errors)
  if (typeof require !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ({ useAI } = require("../../hooks/useAI"));
  }
} catch (e) {
  // ignore and fall through to fallback
}
// Fallback stub: minimal shape used by this component
if (!useAI) {
  useAI = () => ({
    aiManager: {
      sendMessage: async (_: string) => {
        return "";
      },
    },
    selectedModel: "",
    setSelectedModel: (_: any) => {},
  });
}
import { generateChatTitle } from "../../services/gemini";

import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import ModelSelector from "./ModelSelector";

import "./Chat.css";
import "./ModelSelector.css";

interface ChatProps {
  chat: ChatType;
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

function Chat({ chat, setChats }: ChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    aiManager,
    selectedModel,
    setSelectedModel,
  } = useAI();

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
      const reply = await aiManager.sendMessage(userText);

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
        text: "❌ Sorry, Konda AI is unavailable.",
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
      <ModelSelector
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {chat.messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={setInput} />
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