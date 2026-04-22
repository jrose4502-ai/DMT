import React, { useState } from "react";

const WEB3FORMS_KEY = "02dc3cef-cc06-4d45-abbb-0b78fc4a6b5e";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New signup: ${name.trim()} | digitalmarketrix.com`,
          from_name: "Digital Marketrix Website",
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || "Not provided",
          botcheck: "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFeedback("Thanks! We'll be in touch soon.");
        setName("");
        setEmail("");
        setCompany("");
      } else {
        setStatus("error");
        setFeedback(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Could not send. Please email info@digitalmarketrix.com directly.");
    }
  };

  return (
    <div className="signup-card">
      <h3 className="signup-title">Get started with us</h3>
      <p className="signup-lead">
        Share your details and we will reach out about your goals. You can also get occasional tips on web design, SEO, and growth. No spam.
      </p>
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <label className="signup-label">
          <span>Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === "loading"}
            className="signup-input"
          />
        </label>
        <label className="signup-label">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="signup-input"
          />
        </label>
        <label className="signup-label">
          <span>Business name (optional)</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={status === "loading"}
            className="signup-input"
          />
        </label>
        {/* Honeypot spam filter */}
        <input type="checkbox" name="botcheck" style={{ display: "none" }} />
        <button
          type="submit"
          className="btn btn-primary signup-submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Sign up"}
        </button>
        {feedback && (
          <p
            className={`signup-feedback ${status === "success" ? "signup-feedback-success" : "signup-feedback-error"}`}
            role="status"
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
}
