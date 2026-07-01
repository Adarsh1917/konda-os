import type { Chat } from "../types/chat";

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
  return (
    <aside className="sidebar">
      <h2>Konda OS</h2>

      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="section">
        <h3>Chats</h3>

        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px",
              marginBottom: "8px",
              borderRadius: "8px",
              background:
                chat.id === currentChatId
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
            }}
          >
            <span
              onClick={() => onSelectChat(chat.id)}
              style={{
                flex: 1,
                cursor: "pointer",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight:
                  chat.id === currentChatId ? "bold" : "normal",
              }}
            >
              💬 {chat.title}
            </span>

            <button
              onClick={() => {
                if (window.confirm("Delete this chat?")) {
                  onDeleteChat(chat.id);
                }
              }}
              style={{
                marginLeft: "8px",
                background: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                padding: "4px 8px",
                fontSize: "14px",
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>Models</h3>

        <p>🤖 GPT-5.5</p>
        <p>✨ Gemini</p>
        <p>🧠 Claude</p>
      </div>
    </aside>
  );
}

export default Sidebar;