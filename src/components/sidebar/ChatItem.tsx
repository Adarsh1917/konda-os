import type { Chat } from "../../types/chat";

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ChatItem({
  chat,
  isActive,
  onSelect,
  onDelete,
}: ChatItemProps) {
  return (
    <div className={`chat-item ${isActive ? "active" : ""}`}>
      <span
        className="chat-title"
        onClick={onSelect}
      >
        💬 {chat.title}
      </span>

      <button
        className="delete-btn"
        onClick={onDelete}
        title="Delete Chat"
      >
        🗑️
      </button>
    </div>
  );
}

export default ChatItem;