import { useEffect, useState } from "react";
import type { Chat } from "../types/chat";

const STORAGE_KEY = "kondaChats";

function createWelcomeChat(): Chat {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "👋 Hello! I am Konda AI.",
      },
    ],
  };
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [createWelcomeChat()];
  });

  const [currentChatId, setCurrentChatId] = useState(() => chats[0].id);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const createChat = () => {
    const newChat = createWelcomeChat();

    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (id: string) => {
    if (chats.length === 1) {
      alert("You must keep at least one chat.");
      return;
    }

    const updatedChats = chats.filter((chat) => chat.id !== id);

    setChats(updatedChats);

    if (currentChatId === id) {
      setCurrentChatId(updatedChats[0].id);
    }
  };

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) ?? chats[0];

  return {
    chats,
    setChats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    createChat,
    deleteChat,
  };
}