const escapeHtml = require("./escapeHtml");
const { sendTransactional, isSendGridConfigured, DEFAULT_TO } = require("./sendGridMail");

const CALENDLY_PUBLIC =
  process.env.BELLA_CALENDLY_URL || "https://calendly.com/jrose4502/30min";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, preferredTime, notes, source } = req.body || {};

  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanPreferred = String(preferredTime || "").trim();

  if (!cleanName || !cleanEmail || !cleanPreferred) {
    return res
      .status(400)
      .json({ error: "Name, email, and preferred time are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  if (!isSendGridConfigured()) {
    return res.status(503).json({
      error:
        "Scheduling requests are not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.",
    });
  }

  const safe = (v, fb = "Not provided") => (v ? escapeHtml(String(v)) : fb);

  const html = `
    <h2>Bella — preferred time / scheduling request</h2>
    <p><strong>Name:</strong> ${safe(cleanName)}</p>
    <p><strong>Email:</strong> ${safe(cleanEmail)}</p>
    <p><strong>Phone:</strong> ${safe(phone)}</p>
    <p><strong>Preferred time (visitor wording):</strong></p>
    <p>${safe(cleanPreferred)}</p>
    <p><strong>Notes:</strong></p>
    <p>${safe(notes)}</p>
    <p><strong>Source:</strong> ${safe(source, "bella-bot")}</p>
    <hr />
    <p style="color:#888;font-size:12px;">Visitor asked Bella to route this to the team. Confirm in Calendly or reply by email.</p>
  `;

  const notifyTo = String(process.env.BELLA_NOTIFY_TO || DEFAULT_TO).trim() || DEFAULT_TO;

  try {
    await sendTransactional({
      to: notifyTo,
      replyTo: cleanEmail,
      subject: `Scheduling request: ${cleanName} — ${cleanPreferred.slice(0, 60)}`,
      html,
    });

    const visitorCopy = process.env.BELLA_SCHEDULE_VISITOR_COPY !== "0";
    if (visitorCopy) {
      try {
        await sendTransactional({
          to: cleanEmail,
          subject: "We received your preferred meeting time — Digital Marketrix",
          html: `
            <p>Hi ${safe(cleanName)},</p>
            <p>Thanks for your request: <strong>${safe(cleanPreferred)}</strong></p>
            <p>Our team has been notified. If that time is available, we will confirm by email or send you a scheduling link shortly.</p>
            <p>To book instantly anytime, you can also use our calendar: <a href="${escapeHtml(CALENDLY_PUBLIC)}">Schedule here</a>.</p>
            <p>— Digital Marketrix</p>
          `,
        });
      } catch (e) {
        console.warn("bella-schedule-request visitor copy failed:", e.message);
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("bella-schedule-request SendGrid error:", err.response?.body || err);
    return res.status(500).json({ error: "Failed to submit scheduling request." });
  }
};
