import React, { useState } from "react";

const apiBase = process.env.REACT_APP_API_URL || "";

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
      const res = await fetch(`${apiBase}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setFeedback(data.message || "Thanks for signing up.");
      setName("");
      setEmail("");
      setCompany("");
    } catch {
      setStatus("error");
      setFeedback(
        "We could not reach the server. From the website folder run npm run dev (starts API + React), or deploy to Vercel."
      );
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
