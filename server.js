/**
 * Local API server for the signup and contact handlers in /api.
 * Production (Vercel): same modules are deployed as serverless routes.
 *
 * Usage:
 *   npm run api     → only this server (port 3001 by default)
 *   npm run dev     → API + React (proxy sends /api/* here)
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, ".env.local") });
require("dotenv").config({
  path: path.join(__dirname, "sendgrid.env"),
  override: true,
});

const express = require("express");
const signupHandler = require("./api/signup");
const contactHandler = require("./api/contact");

const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

const { isSendGridConfigured } = require("./api/sendGridMail");
if (!isSendGridConfigured()) {
  console.warn(
    "[api] SendGrid: set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env.local (see .env.example)."
  );
}

app.use(express.json({ limit: "100kb" }));

app.post("/api/signup", (req, res) => signupHandler(req, res));
app.post("/api/contact", (req, res) => contactHandler(req, res));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "digital-marketrix-api" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}  POST /api/signup  POST /api/contact  GET /api/health`);
});
