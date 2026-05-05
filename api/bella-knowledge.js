/**
 * Central facts Bella should use (aligned with the live site).
 * Optional: set BELLA_EXTRA_CONTEXT in Vercel / .env.local to append owner-only notes
 * (hours, verticals you serve, promos, boundaries) without editing code.
 */
function getBellaKnowledgeBase() {
  const extra = String(process.env.BELLA_EXTRA_CONTEXT || "").trim();

  const core = `DIGITAL MARKETRIX: FACTS FOR BELLA (use these; do not invent different numbers):

Brand & positioning:
- Premium digital marketing focused on conversion-first websites, SEO, paid traffic (Google & Meta), social, and analytics/CRO.
- Messaging: one unified growth system: high-converting site + visibility + optimization so traffic becomes booked calls and revenue (not random marketing tasks).
- Based in Los Angeles. Founded by Julian Rosario and Angie Rosso; clients work directly with founders who execute and optimize for revenue.

Services (what we actually offer):
- Web design & development: responsive, conversion-focused sites; maintenance and support; e-commerce when relevant.
- SEO & visibility: technical SEO, on-page, keywords, link building, local/buying-intent focus.
- Digital marketing strategy: campaigns, multi-channel growth, brand positioning, reporting.
- Paid ads: Google and Meta setup/management where packages include it.
- Analytics & optimization: tracking, dashboards, CRO, A/B testing, ROI visibility.

Public pricing bands (from the website; packages vary by scope):
- Growth Package: approximately $1,000 – $2,500; includes advanced SEO, social setup/optimization, lead generation strategy; Stripe checkout is linked from the site for eligible purchases.
- Premium Package: typically $2,500 and up; adds paid ads management, conversion optimization, ongoing strategy, monthly performance tracking.
- Custom packages: we build plans when someone does not fit a box; budget conversations are welcome.

Booking & contact:
- Free strategy calls / consultations: ${process.env.BELLA_CALENDLY_URL || "https://calendly.com/jrose4502/30min"}
- General email: info@digitalmarketrix.com
- Website: digitalmarketrix.com

In-chat actions (the visitor can use these in the Bella widget):
- "Book strategy call": opens the live Calendly embed for instant self-service booking and automatic calendar invites.
- "Build my custom plan": collects goals and budget signals and emails the team a summary (custom plan intake).
- "Request a specific time": submits name, email, and preferred day/time in plain language; the team receives an email and follows up to confirm or send a link.
- "Email conversation to team": sends the chat transcript to the team so Julian can reply to nuanced questions.

How to answer pricing questions:
- Give the bands above and say final scope depends on their business; invite a strategy call or custom plan. Never invent exact quotes or promise specific ROI numbers.`;

  if (!extra) return core;
  return `${core}

--- Additional context from the business owner (treat as authoritative; overrides generic guesses) ---
${extra}`;
}

module.exports = { getBellaKnowledgeBase };
