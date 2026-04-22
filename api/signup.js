const escapeHtml = require("./escapeHtml");
const { sendTransactional, isSendGridConfigured } = require("./sendGridMail");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!isSendGridConfigured()) {
    console.error("signup: SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is not configured");
    return res.status(503).json({
      error: "Sign up is not configured yet. Please email info@digitalmarketrix.com directly.",
    });
  }

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeCompany = company ? escapeHtml(String(company).trim()) : "";

  const html = `
      <h2>New website signup</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Business:</strong> ${safeCompany || "Not provided"}</p>
      <hr />
      <p style="color: #888; font-size: 12px;">Submitted from the Digital Marketrix signup form.</p>
    `;

  try {
    await sendTransactional({
      replyTo: email.trim(),
      subject: `New signup: ${name.trim()} | digitalmarketrix.com`,
      html,
    });
    res.json({ success: true, message: "You are signed up. We will be in touch soon." });
  } catch (err) {
    console.error("Signup SendGrid error:", err.response?.body || err);
    res.status(500).json({ error: "Could not complete signup. Please try again later." });
  }
};
