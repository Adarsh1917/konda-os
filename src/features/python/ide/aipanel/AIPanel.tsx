import "./AIPanel.css";

import { BrainCircuit } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function AIPanel() {
  return (
    <aside className="ai-panel">
      <header className="ai-header">
        <BrainCircuit size={18} />

        <span>Konda AI</span>
      </header>

      <div className="ai-messages">

        <ChatMessage
          sender="assistant"
          text="Hello 👋 I'm Konda AI.

I'm here to help you code, debug and learn."
        />

      </div>

      <ChatInput />
    </aside>
  );
}