interface ChatMessageProps {
  sender: "user" | "assistant";
  text: string;
}

export default function ChatMessage({
  sender,
  text,
}: ChatMessageProps) {
  return (
    <div
      className={`chat-message ${sender}`}
    >
      <div className="chat-bubble">
        {text}
      </div>
    </div>
  );
}