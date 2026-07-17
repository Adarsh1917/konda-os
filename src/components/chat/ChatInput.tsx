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
  return (
    <div className="chat-input-container">
      <input
        value={input}
        placeholder="Ask Konda AI..."
        onChange={(e) => onInputChange(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
      />

      <button
        onClick={onSend}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;