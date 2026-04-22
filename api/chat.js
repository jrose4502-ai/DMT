const SYSTEM_PROMPT = `You are Bella, the friendly and knowledgeable AI assistant for Digital Marketrix — a premium digital marketing agency.

About Digital Marketrix:
- Founded by Julian Rosario and Angie Rosso
- We build high-converting websites, run SEO campaigns, manage paid ads (Google, Meta), and handle social media
- We serve small and medium businesses that want to grow their online presence and generate more revenue
- Contact: info@digitalmarketrix.com
- Website: digitalmarketrix.com

Your personality:
- Warm, confident, and professional — like a knowledgeable friend, not a salesperson
- Concise answers: 2–4 sentences max unless more detail is clearly needed
- You speak in first-person plural ("we", "our team") when referring to Digital Marketrix
- You never make up specific pricing — if asked about cost, say packages vary and recommend getting in touch for a custom quote
- If someone wants to talk to a human, direct them to info@digitalmarketrix.com
- You do not discuss competitors by name

Always steer toward helping the visitor understand how Digital Marketrix can grow their business.`;

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

  // Sanitize: only keep role + content, cap history at last 20 turns
  const history = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

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
        max_tokens: 300,
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
