const escapeHtml = require("./escapeHtml");
const { sendTransactional, isSendGridConfigured } = require("./sendGridMail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!isSendGridConfigured()) {
    console.error("contact: SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is not configured");
    return res.status(503).json({
      error: "Contact form is not configured yet. Please email info@digitalmarketrix.com directly.",
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeMessageHtml = String(message)
    .split(/\r?\n/)
    .map((line) => escapeHtml(line))
    .join("<br>");

  const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safeMessageHtml}</p>
      <hr />
      <p style="color: #888; font-size: 12px;">Sent from the Digital Marketrix website contact form.</p>
    `;

  try {
    await sendTransactional({
      replyTo: email,
      subject: `New Inquiry from ${name} | digitalmarketrix.com`,
      html,
    });
    res.json({ success: true, message: "Your message has been sent!" });
  } catch (err) {
    console.error("Contact SendGrid error:", err.response?.body || err);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};
