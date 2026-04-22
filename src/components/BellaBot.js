import React, { useState, useEffect, useRef } from 'react';
import '../styles/BellaBot.css';

const INITIAL_MESSAGE = "Hi! I'm Bella, your Digital Marketrix assistant. How can I help you grow your business today?";

const BellaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: INITIAL_MESSAGE }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setInputValue('');
    const userMsg = { role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Build the API history: only user/assistant turns (skip the initial greeting
    // since it was never part of an API call)
    const apiHistory = updatedMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Request failed');
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Sorry, I'm having trouble connecting right now. Please email info@digitalmarketrix.com and we'll get back to you!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`bella-bot-container ${isOpen ? 'open' : ''}`}>
      <button
        className="bella-bot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat with Bella'}
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
        {!isOpen && <span className="notification-dot"></span>}
      </button>

      <div className="bella-bot-window" role="dialog" aria-label="Bella chat assistant">
        <div className="bella-bot-header">
          <div className="bot-info">
            <div className="bot-avatar">B</div>
            <div>
              <h4>Bella</h4>
              <p><span className="online-status"></span> AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="bella-bot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="bella-bot-input" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            aria-label="Chat message"
          />
          <button type="submit" disabled={isTyping || !inputValue.trim()} aria-label="Send message">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BellaBot;
