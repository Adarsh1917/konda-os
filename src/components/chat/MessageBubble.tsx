import "./Message.css";
import type { Message } from "../../types/chat";

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`message-row ${
        message.sender === "user" ? "user-row" : "ai-row"
      }`}
    >
      <div className="avatar">
        {message.sender === "user" ? "👤" : "🤖"}
      </div>

      <div className="message-content">
        <div className={`message ${message.sender}`}>
          <div className="message-text">
            {message.text}
          </div>

          <div className="message-footer">
            <span className="message-time">{time}</span>

            {message.sender === "ai" && (
              <button
                className="copy-btn"
                onClick={copyMessage}
              >
                📋 Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;