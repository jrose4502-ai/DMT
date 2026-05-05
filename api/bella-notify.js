const escapeHtml = require("./escapeHtml");
const { sendTransactional, isSendGridConfigured, DEFAULT_TO } = require("./sendGridMail");

const MAX_TRANSCRIPT = 24000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, visitorName, visitorEmail, source } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required." });
  }

  if (messages.length > 120) {
    return res.status(400).json({ error: "Too many messages in transcript." });
  }

  if (!isSendGridConfigured()) {
    return res.status(503).json({
      error:
        "Email notifications are not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.",
    });
  }

  const lines = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "user" ? "Visitor" : m.role === "assistant" ? "Bella" : String(m.role || "");
    const content = typeof m.content === "string" ? m.content : "";
    if (!content.trim()) continue;
    lines.push(`${role}: ${content}`);
  }

  let transcript = lines.join("\n\n");
  if (transcript.length > MAX_TRANSCRIPT) {
    transcript = transcript.slice(-MAX_TRANSCRIPT);
  }

  if (!transcript.trim()) {
    return res.status(400).json({ error: "No transcript content to send." });
  }

  const rawName = String(visitorName || "").trim();
  const name = escapeHtml(rawName) || "Anonymous";
  const email = String(visitorEmail || "").trim();
  const safeSource = escapeHtml(String(source || "bella-bot"));
  const subjectLabel =
    rawName.length > 0 ? rawName.slice(0, 80) : "a visitor";

  const html = `
    <h2>Bella chat — conversation emailed from the website</h2>
    <p><strong>Visitor name:</strong> ${name}</p>
    <p><strong>Visitor email:</strong> ${email ? escapeHtml(email) : "Not provided"}</p>
    <p><strong>Source:</strong> ${safeSource}</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;">${escapeHtml(transcript)}</pre>
    <hr />
    <p style="color:#888;font-size:12px;">Sent from Bella on digitalmarketrix.com</p>
  `;

  const notifyTo = String(process.env.BELLA_NOTIFY_TO || DEFAULT_TO).trim() || DEFAULT_TO;

  try {
    await sendTransactional({
      to: notifyTo,
      replyTo: email || undefined,
      subject: `Bella chat: ${subjectLabel}`,
      html,
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("bella-notify SendGrid error:", err.response?.body || err);
    return res.status(500).json({ error: "Failed to send notification." });
  }
};
