import { useState } from "react";
import type { FormEvent } from "react";

import { useAI } from "../../ai/hooks/useAI";
import styles from "./AIChatSpace.module.css";

export default function AIChatSpace() {
  const { messages, loading, status, error, ask } = useAI();
  const [prompt, setPrompt] = useState("");
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  async function submit(nextPrompt: string) {
    const trimmedPrompt = nextPrompt.trim();
    if (!trimmedPrompt || loading) {
      return;
    }

    setPrompt("");
    setRequestError(null);
    setLastFailedPrompt(null);

    try {
      const response = await ask(trimmedPrompt);

      if (!response.success) {
        setLastFailedPrompt(trimmedPrompt);
        setRequestError(
          response.content ||
            "Unable to reach the selected AI provider. Check your provider configuration and try again.",
        );
        return;
      }

      setLastFailedPrompt(null);
      setRequestError(null);
    } catch (error) {
      setLastFailedPrompt(trimmedPrompt);
      setRequestError(
        error instanceof Error
          ? error.message
          : "Unable to reach the selected AI provider. Check your provider configuration and try again.",
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(prompt);
  }

  const statusLabel =
    status === "sending"
      ? "Generating..."
      : status === "error"
        ? "Provider error"
        : status === "success"
          ? "Response ready"
          : "Ready";

  const displayError = requestError || error;

  return (
    <section className={styles.chat} aria-label="AI Chat Space">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>KONDA AI</p>
          <h1>AI Chat Space</h1>
        </div>
        <span className={styles.status}>{loading ? "Working..." : statusLabel}</span>
      </header>

      <div className={styles.messages} aria-live="polite">
        {messages.length === 0 && (
          <div className={styles.empty}>
            <h2>Ask Konda anything</h2>
            <p>Your request will be sent to the configured AI provider.</p>
          </div>
        )}
        {messages.map((message) => (
          <article
            className={`${styles.message} ${
              message.role === "user" ? styles.userMessage : styles.assistantMessage
            }`}
            key={message.id}
          >
            <strong>{message.role === "user" ? "You" : "Konda AI"}</strong>
            <p>{message.content}</p>
          </article>
        ))}
        {displayError && (
          <div className={styles.error} role="alert">
            <p>{displayError}</p>
            {lastFailedPrompt && (
              <button type="button" onClick={() => void submit(lastFailedPrompt)}>
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <input
          aria-label="Message input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Message Konda AI..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
