const escapeHtml = require("./escapeHtml");
const { sendTransactional, isSendGridConfigured } = require("./sendGridMail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    phone,
    businessType,
    monthlyBudget,
    timeline,
    goals,
    generatedPlanSummary,
    source,
  } = req.body || {};

  if (!name || !email || !goals) {
    return res
      .status(400)
      .json({ error: "Name, email, and goals are required." });
  }

  if (!isSendGridConfigured()) {
    return res.status(503).json({
      error:
        "Bella intake is not configured yet. Please email info@digitalmarketrix.com directly.",
    });
  }

  const safe = (value, fallback = "Not provided") =>
    value ? escapeHtml(String(value)) : fallback;

  const html = `
      <h2>New Bella Custom Plan Intake</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Phone:</strong> ${safe(phone)}</p>
      <p><strong>Business Type:</strong> ${safe(businessType)}</p>
      <p><strong>Monthly Budget:</strong> ${safe(monthlyBudget)}</p>
      <p><strong>Timeline:</strong> ${safe(timeline)}</p>
      <p><strong>Lead Source:</strong> ${safe(source, "bella-bot")}</p>
      <hr />
      <p><strong>Goals:</strong></p>
      <p>${safe(goals).replace(/\r?\n/g, "<br>")}</p>
      <hr />
      <p><strong>Bella Generated Plan:</strong></p>
      <p>${safe(generatedPlanSummary).replace(/\r?\n/g, "<br>")}</p>
      <hr />
      <p style="color: #888; font-size: 12px;">Submitted from Bella assistant on digitalmarketrix.com.</p>
    `;

  try {
    await sendTransactional({
      replyTo: email,
      subject: `Bella Intake: ${name} | digitalmarketrix.com`,
      html,
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("bella-intake SendGrid error:", err.response?.body || err);
    return res
      .status(500)
      .json({ error: "Failed to submit intake. Please try again later." });
  }
};
