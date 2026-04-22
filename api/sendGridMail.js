const path = require("path");

// Load local secrets when API handlers run (does not override vars set by Vercel/hosting).
try {
  require("dotenv").config({
    path: path.join(__dirname, "..", ".env.local"),
  });
  require("dotenv").config({
    path: path.join(__dirname, "..", ".env"),
  });
  require("dotenv").config({
    path: path.join(__dirname, "..", "sendgrid.env"),
    override: true,
  });
} catch (_) {
  /* dotenv optional in some deploy targets */
}

const sgMail = require("@sendgrid/mail");

const DEFAULT_TO = "info@digitalmarketrix.com";

function verifiedFromEmail() {
  return (
    process.env.SENDGRID_FROM_EMAIL ||
    process.env.SENDGRID_VERIFIED_SENDER ||
    ""
  ).trim();
}

function getSendGridApiKey() {
  return String(process.env.SENDGRID_API_KEY || "").trim();
}

function isSendGridConfigured() {
  return Boolean(getSendGridApiKey() && verifiedFromEmail());
}

/**
 * @param {{ to?: string, replyTo?: string, subject: string, html: string }} opts
 */
async function sendTransactional(opts) {
  const apiKey = getSendGridApiKey();
  const fromEmail = verifiedFromEmail();
  if (!apiKey || !fromEmail) {
    const err = new Error("SendGrid is not configured");
    err.code = "ENOTCONFIGURED";
    throw err;
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to: opts.to || DEFAULT_TO,
    from: {
      email: fromEmail,
      name: process.env.SENDGRID_FROM_NAME || "Digital Marketrix Website",
    },
    subject: opts.subject,
    html: opts.html,
  };

  if (opts.replyTo) {
    msg.replyTo = opts.replyTo;
  }

  await sgMail.send(msg);
}

module.exports = {
  sendTransactional,
  isSendGridConfigured,
  DEFAULT_TO,
};
