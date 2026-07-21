import "./ChatInput.css";

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

function ChatInput({
  input,
  loading,
  onInputChange,
  onSend,
}: ChatInputProps) {
  const quickActions = [
    "📚 Study",
    "💻 Code",
    "✨ Explain",
    "📝 Summarize",
  ];

  return (
    <div className="chat-input-wrapper">
      <div className="quick-actions">
        {quickActions.map((action) => (
          <button
            key={action}
            className="quick-action-btn"
            onClick={() => onInputChange(action + " ")}
            disabled={loading}
          >
            {action}
          </button>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          value={input}
          placeholder="Ask Konda AI anything..."
          onChange={(e) => onInputChange(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />

        <button
          className="send-button"
          onClick={onSend}
          disabled={loading}
        >
          {loading ? "⏳" : "➤"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;