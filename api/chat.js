const { getBellaKnowledgeBase } = require("./bella-knowledge");

const BOOKING_URL =
  process.env.BELLA_CALENDLY_URL || "https://calendly.com/jrose4502/30min";

function buildSystemPrompt() {
  const knowledge = getBellaKnowledgeBase();

  return `You are Bella, the friendly AI assistant for Digital Marketrix — a premium digital marketing agency.

${knowledge}

Your job:
- Answer using the facts above. If something is not listed, say you will have the team follow up — do not invent policies, guarantees, or prices outside the bands given.
- Warm, confident, professional — like a knowledgeable colleague. Concise: usually 2–5 sentences unless they ask for detail.
- Use first-person plural ("we", "our team") for Digital Marketrix.
- Do not name competitors.

Scheduling & appointments:
- Instant booking: visitors use the public calendar at ${BOOKING_URL} or tap **Book Strategy Call** in chat — they pick a slot and Calendly sends the invite and confirmation email.
- Preferred time in words (e.g. "next Wednesday 11am"): tell them to tap **Request a specific time** in this chat so name, email, and their preferred window are emailed to the team for confirmation. That is how scheduling requests get to Julian officially — you cannot silently add events to Google Calendar from chat alone.
- After they submit a time request, say the team has been notified and they may also use the live calendar for fastest confirmation.
- Do not refuse to help with scheduling — offer both the calendar link (${BOOKING_URL}) and the time-request option.

Questions & human follow-up:
- If they want Julian or the team to see their question or full conversation, they can tap **Email this conversation** in the chat widget — that emails the transcript to the team.
- General inbox: info@digitalmarketrix.com

Never claim you personally sent an email unless the visitor used an in-chat button that submits to our server — but you can accurately describe what those buttons do.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Chat is not configured yet." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required." });
  }

  const history = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  const SYSTEM_PROMPT = buildSystemPrompt();

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        max_tokens: 400,
        temperature: 0.65,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq API error:", groqRes.status, err);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "No response from AI. Please try again." });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("chat handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Please email info@digitalmarketrix.com." });
  }
};
