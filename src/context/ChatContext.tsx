import {
  createContext,
  useContext,
} from "react";

import { useChats } from "../hooks/useChats";

const ChatContext = createContext<
  ReturnType<typeof useChats> | undefined
>(undefined);

export function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = useChats();

  return (
    <ChatContext.Provider value={chats}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChatContext must be used inside ChatProvider."
    );
  }

  return context;
}