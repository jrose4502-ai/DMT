import React, { useState, useEffect, useRef } from 'react';
import '../styles/BellaBot.css';

const INITIAL_MESSAGE =
  "Hi! I'm Bella, your Digital Marketrix assistant. Ask about our services and pricing, tap Book Strategy Call for instant scheduling, use Request a specific time if you want us to confirm a slot by email, or Email conversation to team to send this chat to Julian.";
const CALENDLY_URL = 'https://calendly.com/jrose4502/30min';

const URL_IN_TEXT = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

function parseMessageSegments(text) {
  if (!text) return [{ type: 'text', value: '' }];
  const segments = [];
  let last = 0;
  const re = new RegExp(URL_IN_TEXT.source, URL_IN_TEXT.flags);
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', value: text.slice(last, m.index) });
    }
    const raw = m[0];
    const href = raw.replace(/[.,);:!?]+$/u, '');
    segments.push({ type: 'link', value: href });
    last = m.index + raw.length;
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }
  if (segments.length === 0) segments.push({ type: 'text', value: text });
  return segments;
}

function linkAnchorLabel(href) {
  try {
    const u = new URL(href);
    if (u.hostname.includes('calendly.com')) return 'Schedule your call';
  } catch (_) {
    /* ignore */
  }
  return 'Open link';
}

function MessageBody({ text }) {
  const segments = parseMessageSegments(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'link' ? (
          <a
            key={`${seg.value}-${i}`}
            href={seg.value}
            target="_blank"
            rel="noopener noreferrer"
            className="bella-inline-link"
          >
            {linkAnchorLabel(seg.value)}
          </a>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </>
  );
}

function buildPlanSummary({ businessType, monthlyBudget, timeline, goals }) {
  const budget = Number(monthlyBudget || 0);
  let tier = 'starter';
  if (budget >= 3000) tier = 'growth';
  if (budget >= 7000) tier = 'scale';

  const planByTier = {
    starter:
      'Starter Plan: conversion-focused website updates, local SEO foundation, and a lightweight ad test to validate audience demand.',
    growth:
      'Growth Plan: full funnel optimization with SEO content sprint, paid ads management, and conversion tracking improvements.',
    scale:
      'Scale Plan: multi-channel performance engine with advanced creatives, CRO testing, and weekly optimization cadence.',
  };

  const timelineText = timeline || 'your preferred timeline';
  const businessText = businessType || 'your business';
  const goalsText = goals || 'qualified leads and consistent revenue growth';

  return `Based on what you shared, here is a recommended direction for ${businessText}: ${planByTier[tier]} Expected timeline: ${timelineText}. Primary focus: ${goalsText}.`;
}

const BellaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: INITIAL_MESSAGE }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showTimeRequest, setShowTimeRequest] = useState(false);
  const [showEmailTranscript, setShowEmailTranscript] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [notifyMeta, setNotifyMeta] = useState({ name: '', email: '' });
  const [timeRequest, setTimeRequest] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    notes: '',
  });
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
  }, [messages, isTyping, showScheduler, showTimeRequest, showEmailTranscript, showPlanner]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addAssistantMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'assistant', text }]);
  };

  const handleQuickBook = () => {
    setShowScheduler(true);
    addAssistantMessage(
      "Here's our live calendar — choose a time that works for you. You'll get a confirmation email with your meeting details."
    );
  };

  const handlePlannerChange = (e) => {
    const { name, value } = e.target;
    setPlanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifyMetaChange = (e) => {
    const { name, value } = e.target;
    setNotifyMeta((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeRequestChange = (e) => {
    const { name, value } = e.target;
    setTimeRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailTranscriptSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingNotify) return;

    setIsSubmittingNotify(true);
    try {
      const res = await fetch('/api/bella-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.text })),
          visitorName: notifyMeta.name.trim(),
          visitorEmail: notifyMeta.email.trim(),
          source: 'bella-bot',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');

      addAssistantMessage(
        "Done — I've emailed this conversation to the Digital Marketrix team. They'll reply when a human answer is needed."
      );
      setShowEmailTranscript(false);
    } catch (_) {
      addAssistantMessage(
        'Could not send the email right now. Please write to info@digitalmarketrix.com with your question.'
      );
    } finally {
      setIsSubmittingNotify(false);
    }
  };

  const handleTimeRequestSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingSchedule) return;

    const { name, email, phone, preferredTime, notes } = timeRequest;
    if (!name.trim() || !email.trim() || !preferredTime.trim()) {
      addAssistantMessage('Please add your name, email, and preferred time so we can route your request.');
      return;
    }

    setIsSubmittingSchedule(true);
    try {
      const res = await fetch('/api/bella-schedule-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferredTime: preferredTime.trim(),
          notes: notes.trim(),
          source: 'bella-bot',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');

      addAssistantMessage(
        "Got it — I've sent your preferred time to the team. Check your email for a quick confirmation. For the fastest booking, you can also grab any open slot here: https://calendly.com/jrose4502/30min"
      );
      setShowTimeRequest(false);
      setTimeRequest((prev) => ({
        ...prev,
        preferredTime: '',
        notes: '',
      }));
    } catch (_) {
      addAssistantMessage(
        'Could not submit that request right now. Please email info@digitalmarketrix.com or use Book Strategy Call.'
      );
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handlePlannerSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingPlan) return;

    if (!planner.name.trim() || !planner.email.trim() || !planner.goals.trim()) {
      addAssistantMessage('Please include your name, email, and goals so I can build your custom plan.');
      return;
    }

    setIsSubmittingPlan(true);

    const summary = buildPlanSummary(planner);
    addAssistantMessage(summary);
    addAssistantMessage(
      'Next step: book your strategy call below so we can finalize your plan together live.'
    );
    setShowScheduler(true);

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
          text:
            "Sorry, I'm having trouble connecting right now. Please email info@digitalmarketrix.com or book directly at https://calendly.com/jrose4502/30min — we'll get back to you!",
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

      <div
        className={`bella-bot-window ${
          showScheduler || showTimeRequest || showEmailTranscript || showPlanner ? 'bella-bot-window--tall' : ''
        }`}
        role="dialog"
        aria-label="Bella chat assistant"
      >
        <div className="bella-bot-header">
          <div className="bot-info">
            <div className="bot-avatar">B</div>
            <div>
              <h4>Bella</h4>
              <p>
                <span className="online-status"></span> AI Assistant
              </p>
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
              onClick={() => {
                setShowTimeRequest(false);
                setShowEmailTranscript(false);
                setShowPlanner((prev) => !prev);
              }}
            >
              Build My Custom Plan
            </button>
            <button
              type="button"
              className="bella-chip"
              onClick={() => {
                const next = !showTimeRequest;
                setShowEmailTranscript(false);
                setShowPlanner(false);
                setShowTimeRequest(next);
              }}
            >
              Request a specific time
            </button>
            <button
              type="button"
              className="bella-chip"
              onClick={() => {
                const next = !showEmailTranscript;
                setShowTimeRequest(false);
                setShowPlanner(false);
                setShowEmailTranscript(next);
              }}
            >
              Email conversation to team
            </button>
          </div>

          {showScheduler && (
            <div className="bella-calendly-section">
              <div className="bella-calendly-toolbar">
                <span className="bella-calendly-title">Schedule a call</span>
                <button type="button" className="bella-calendly-hide" onClick={() => setShowScheduler(false)}>
                  Hide
                </button>
              </div>
              <iframe
                title="Book a strategy call with Digital Marketrix"
                src={`${CALENDLY_URL}?embed=true`}
                className="bella-calendly-iframe"
                loading="lazy"
              />
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bella-calendly-fullpage"
              >
                Open scheduler in full page
              </a>
            </div>
          )}

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
                {isSubmittingPlan ? 'Building...' : 'Generate Plan + Send'}
              </button>
            </form>
          )}

          {showTimeRequest && (
            <form className="bella-plan-form bella-aux-form" onSubmit={handleTimeRequestSubmit}>
              <p className="bella-aux-hint">
                Tell us when you want to meet — we email the team and you get a confirmation message. For instant booking,
                use Book Strategy Call.
              </p>
              <input
                name="name"
                type="text"
                placeholder="Name *"
                value={timeRequest.name}
                onChange={handleTimeRequestChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={timeRequest.email}
                onChange={handleTimeRequestChange}
                required
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone (optional)"
                value={timeRequest.phone}
                onChange={handleTimeRequestChange}
              />
              <input
                name="preferredTime"
                type="text"
                placeholder="Preferred time (e.g. Next Wednesday 11:00 AM PT) *"
                value={timeRequest.preferredTime}
                onChange={handleTimeRequestChange}
                required
              />
              <textarea
                name="notes"
                rows="2"
                placeholder="Anything else we should know (optional)"
                value={timeRequest.notes}
                onChange={handleTimeRequestChange}
              />
              <button type="submit" disabled={isSubmittingSchedule}>
                {isSubmittingSchedule ? 'Sending…' : 'Send to team'}
              </button>
            </form>
          )}

          {showEmailTranscript && (
            <form className="bella-plan-form bella-aux-form" onSubmit={handleEmailTranscriptSubmit}>
              <p className="bella-aux-hint">
                Emails this whole conversation to Digital Marketrix. Add your email so Julian can reply.
              </p>
              <input
                name="name"
                type="text"
                placeholder="Your name (optional)"
                value={notifyMeta.name}
                onChange={handleNotifyMetaChange}
              />
              <input
                name="email"
                type="email"
                placeholder="Your email (recommended)"
                value={notifyMeta.email}
                onChange={handleNotifyMetaChange}
              />
              <button type="submit" disabled={isSubmittingNotify}>
                {isSubmittingNotify ? 'Sending…' : 'Email transcript to team'}
              </button>
            </form>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
              <div className="message-content">
                <MessageBody text={msg.text} />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
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
