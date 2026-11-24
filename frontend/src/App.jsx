import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/chat";

const starterQuestions = [
  "Explain Java OOP with simple examples",
  "Help me prepare for a React interview",
  "What is a REST API?",
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = input) {
    const trimmedText = text.trim();

    if (!trimmedText || loading) {
      return;
    }

    const updatedMessages = [
      ...messages,
      { role: "user", content: trimmedText },
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed (${response.status})`);
      }

      if (!data.reply) {
        throw new Error("The server returned an empty reply.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "model", content: data.reply },
      ]);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Could not connect to the backend. Check that Spring Boot is running."
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function clearChat() {
    if (loading) return;
    setMessages([]);
    setError("");
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>Nova AI</strong>
            <span>CHAT ASSISTANT</span>
          </div>
        </div>

        <button className="new-chat-button" onClick={clearChat} disabled={loading}>
          <span>＋</span> New conversation
        </button>

        <div className="sidebar-label">YOUR SPACE</div>
        <div className="sidebar-note">
          <span className="note-icon">◷</span>
          <div>
            <strong>Conversation</strong>
            <small>Current session</small>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <span>Powered by Google Gemini</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="mobile-brand">✦ Nova AI</span>
            <span className="page-title">AI Assistant</span>
          </div>
          <div className="topbar-right">
            <span className="online-indicator"><i /> AI online</span>
            <button className="clear-button" onClick={clearChat} disabled={loading}>
              Clear chat
            </button>
          </div>
        </header>

        <section className={`conversation ${messages.length === 0 ? "empty" : ""}`}>
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <p className="eyebrow">YOUR AI COMPANION</p>
              <h1>What can I help<br />you <span>figure out?</span></h1>
              <p className="welcome-copy">
                Ask questions, explore ideas, or get help with your next big project.
              </p>

              <div className="suggestion-heading">TRY ASKING</div>
              <div className="suggestions">
                {starterQuestions.map((question) => (
                  <button
                    className="suggestion"
                    key={question}
                    onClick={() => sendMessage(question)}
                    disabled={loading}
                  >
                    <span>↗</span>{question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role === "user" ? "user-row" : "assistant-row"}`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === "model" && <div className="avatar assistant-avatar">✦</div>}
                  <div className={`message-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
                    <div className="message-author">
                      {message.role === "user" ? "You" : "Nova AI"}
                    </div>
                    <p>{message.content}</p>
                  </div>
                  {message.role === "user" && <div className="avatar user-avatar">Y</div>}
                </div>
              ))}

              {loading && (
                <div className="message-row assistant-row">
                  <div className="avatar assistant-avatar">✦</div>
                  <div className="message-bubble assistant-bubble">
                    <div className="message-author">Nova AI</div>
                    <div className="typing"><i /><i /><i /><span>Thinking</span></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <div className="composer-wrap">
          {error && (
            <div className="error-message" role="alert">
              <strong>Something went wrong:</strong> {error}
            </div>
          )}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit(event);
                }
              }}
              placeholder="Message Nova AI..."
              rows="1"
              aria-label="Message Nova AI"
              disabled={loading}
            />
            <button className="send-button" type="submit" disabled={!input.trim() || loading}>
              {loading ? "…" : "↑"}
            </button>
          </form>
          <p className="disclaimer">AI can make mistakes. Check important information.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
