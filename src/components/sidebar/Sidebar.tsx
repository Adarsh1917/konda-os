import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "./SearchBar";
import ChatItem from "./ChatItem";
import "./Sidebar.css";

import { useChatContext } from "../../context/ChatContext";

function Sidebar() {
  const navigate = useNavigate();

  const {
    chats,
    currentChatId,
    setCurrentChatId,
    createChat,
    deleteChat,
  } = useChatContext();

  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🚀 Konda OS</h2>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <button
        className="button new-chat-btn"
        onClick={() => {
          createChat();
          navigate("/chat");
        }}
      >
        + New Chat
      </button>

      <div className="chat-list">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChatId}
            onSelect={() => {
              setCurrentChatId(chat.id);
              navigate("/chat");
            }}
            onDelete={() => {
              if (window.confirm("Delete this chat?")) {
                deleteChat(chat.id);
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