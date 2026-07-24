import { useState } from "react";

import { Send } from "lucide-react";

export default function ChatInput() {
  const [message, setMessage] =
    useState("");

  const send = () => {
    if (!message.trim()) return;

    console.log(message);

    setMessage("");
  };

  return (
    <div className="chat-input">

      <input
        value={message}
        placeholder="Ask Konda AI..."
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
      />

      <button onClick={send}>
        <Send size={16} />
      </button>

    </div>
  );
}