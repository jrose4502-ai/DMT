import React, { useState, useEffect, useRef } from 'react';
import '../styles/BellaBot.css';

const INITIAL_MESSAGE = "Hi! I'm Bella, your Digital Marketrix assistant. How can I help you grow your business today?";
const CALENDLY_URL = "https://calendly.com/jrose4502/30min";

function buildPlanSummary({ businessType, monthlyBudget, timeline, goals }) {
  const budget = Number(monthlyBudget || 0);
  let tier = "starter";
  if (budget >= 3000) tier = "growth";
  if (budget >= 7000) tier = "scale";

  const planByTier = {
    starter:
      "Starter Plan: conversion-focused website updates, local SEO foundation, and a lightweight ad test to validate audience demand.",
    growth:
      "Growth Plan: full funnel optimization with SEO content sprint, paid ads management, and conversion tracking improvements.",
    scale:
      "Scale Plan: multi-channel performance engine with advanced creatives, CRO testing, and weekly optimization cadence.",
  };

  const timelineText = timeline || "your preferred timeline";
  const businessText = businessType || "your business";
  const goalsText = goals || "qualified leads and consistent revenue growth";

  return `Based on what you shared, here is a recommended direction for ${businessText}: ${planByTier[tier]} Expected timeline: ${timelineText}. Primary focus: ${goalsText}.`;
}

const BellaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: INITIAL_MESSAGE }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [planner, setPlanner] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    monthlyBudget: '',
    timeline: '',
    goals: '',
  });
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

  const addAssistantMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'assistant', text }]);
  };

  const handleQuickBook = () => {
    addAssistantMessage(
      `Great call. You can pick a time here and we'll take care of the rest: ${CALENDLY_URL}`
    );
    window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
  };

  const handlePlannerChange = (e) => {
    const { name, value } = e.target;
    setPlanner((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlannerSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingPlan) return;

    if (!planner.name.trim() || !planner.email.trim() || !planner.goals.trim()) {
      addAssistantMessage("Please include your name, email, and goals so I can build your custom plan.");
      return;
    }

    setIsSubmittingPlan(true);

    const summary = buildPlanSummary(planner);
    addAssistantMessage(summary);
    addAssistantMessage(
      `Next step: book your strategy call so we can finalize your custom build plan with you live: ${CALENDLY_URL}`
    );

    try {
      await fetch('/api/bella-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...planner,
          generatedPlanSummary: summary,
          source: 'bella-bot',
        }),
      });
    } catch (_) {
      // Do not block the user flow if intake logging fails.
    } finally {
      setIsSubmittingPlan(false);
      setShowPlanner(false);
    }
  };

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
          <div className="bella-quick-actions" aria-label="Bella quick actions">
            <button type="button" className="bella-chip" onClick={handleQuickBook}>
              Book Strategy Call
            </button>
            <button
              type="button"
              className="bella-chip"
              onClick={() => setShowPlanner((prev) => !prev)}
            >
              Build My Custom Plan
            </button>
          </div>

          {showPlanner && (
            <form className="bella-plan-form" onSubmit={handlePlannerSubmit}>
              <input
                name="name"
                type="text"
                placeholder="Name *"
                value={planner.name}
                onChange={handlePlannerChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={planner.email}
                onChange={handlePlannerChange}
                required
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone (optional)"
                value={planner.phone}
                onChange={handlePlannerChange}
              />
              <input
                name="businessType"
                type="text"
                placeholder="Business type / niche"
                value={planner.businessType}
                onChange={handlePlannerChange}
              />
              <input
                name="monthlyBudget"
                type="number"
                min="0"
                step="100"
                placeholder="Monthly budget (USD)"
                value={planner.monthlyBudget}
                onChange={handlePlannerChange}
              />
              <input
                name="timeline"
                type="text"
                placeholder="Timeline (e.g. 30-60 days)"
                value={planner.timeline}
                onChange={handlePlannerChange}
              />
              <textarea
                name="goals"
                rows="3"
                placeholder="Top goals *"
                value={planner.goals}
                onChange={handlePlannerChange}
                required
              />
              <button type="submit" disabled={isSubmittingPlan}>
                {isSubmittingPlan ? "Building..." : "Generate Plan + Send"}
              </button>
            </form>
          )}

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
