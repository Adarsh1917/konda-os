import type { Message } from "../../types/chat";

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message ${message.sender}`}>
      {message.text}
    </div>
  );
}

export default MessageBubble;