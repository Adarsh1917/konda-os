import type { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import type { Chat } from "../types/chat";

interface MainLayoutProps {
  children: ReactNode;
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

function MainLayout({
  children,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: MainLayoutProps) {
  return (
    <div className="app">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={onSelectChat}
        onNewChat={onNewChat}
        onDeleteChat={onDeleteChat}
      />

      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default MainLayout;