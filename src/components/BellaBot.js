import React, { useState, useEffect, useRef } from 'react';
import '../styles/BellaBot.css';

const BellaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Bella, your Digital Marketrix assistant. How can I help you grow your business today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('package')) {
        botResponse = "We have several packages starting from $499/mo. Our most popular is the Growth Package. Would you like to see the full pricing section?";
      } else if (lowerMsg.includes('service') || lowerMsg.includes('what do you do')) {
        botResponse = "We specialize in high-converting websites, SEO, paid ads, and social media management. We're all about making you more money online!";
      } else if (lowerMsg.includes('contact') || lowerMsg.includes('call') || lowerMsg.includes('email')) {
        botResponse = "You can reach us at info@digitalmarketrix.com or via the contact form below. Would you like me to scroll you there?";
      } else if (lowerMsg.includes('julian') || lowerMsg.includes('angie')) {
        botResponse = "Julian Rosario and Angie Rosso are our founders! They built Digital Marketrix to help businesses like yours thrive.";
      } else {
        botResponse = "That's a great question! The best way to get a specific answer for your business is to schedule a quick discovery call. Should I show you how?";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={`bella-bot-container ${isOpen ? 'open' : ''}`}>
      <button className="bella-bot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
        {!isOpen && <span className="notification-dot"></span>}
      </button>

      <div className="bella-bot-window">
        <div className="bella-bot-header">
          <div className="bot-info">
            <div className="bot-avatar">B</div>
            <div>
              <h4>Bella Bot</h4>
              <p><span className="online-status"></span> Online</p>
            </div>
          </div>
        </div>

        <div className="bella-bot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
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
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BellaBot;
