import { useState } from "react";
import type { Chat } from "../../types/chat";
import SearchBar from "./SearchBar";
import ChatItem from "./ChatItem";
import "./Sidebar.css";

interface SidebarProps {
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🚀 Konda OS</h2>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <button className="button new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="chat-list">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChatId}
            onSelect={() => onSelectChat(chat.id)}
            onDelete={() => {
              if (window.confirm("Delete this chat?")) {
                onDeleteChat(chat.id);
              }
            }}
          />
        ))}
      </div>

      <div className="sidebar-footer">
        <small>Konda OS v0.1</small>
      </div>
    </aside>
  );
}

export default Sidebar;