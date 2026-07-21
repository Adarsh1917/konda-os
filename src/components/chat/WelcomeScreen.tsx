import "./Chat.css";

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const suggestions = [
    "📚 Help me study today's topics",
    "💻 Explain this programming concept",
    "📝 Summarize my notes",
    "🎯 Plan my day",
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="ai-avatar">🤖</div>

        <h1>Welcome to Konda AI</h1>

        <p className="welcome-subtitle">
          Your personal AI companion for learning,
          coding, planning and creating.
        </p>

        <div className="suggestion-grid">
          {suggestions.map((item) => (
            <button
              key={item}
              className="suggestion-card"
              onClick={() => onSuggestionClick(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="welcome-footer">
          Click a suggestion or type your own message.
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;