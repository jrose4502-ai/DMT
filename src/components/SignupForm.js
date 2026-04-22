import React, { useState } from "react";

const WEB3FORMS_KEY = "02dc3cef-cc06-4d45-abbb-0b78fc4a6b5e";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[\d\s().+\-]{7,20}$/.test(phone.trim()); // eslint-disable-line no-useless-escape
}

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(phone)) e.phone = "Enter a valid phone number.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setFeedback("");
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setStatus("error");
      return;
    }
    setErrors({});
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
          phone: phone.trim(),
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
        setPhone("");
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

  const isLoading = status === "loading";

  return (
    <div className="signup-card">
      <h3 className="signup-title">Get started with us</h3>
      <p className="signup-lead">
        Share your details and we will reach out about your goals. No spam.
      </p>
      <form className="signup-form" onSubmit={handleSubmit} noValidate>

        <label className="signup-label">
          <span>Name <span className="signup-required">*</span></span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
            disabled={isLoading}
            className={`signup-input${errors.name ? " signup-input-error" : ""}`}
            placeholder="Your full name"
          />
          {errors.name && <span className="signup-field-error">{errors.name}</span>}
        </label>

        <label className="signup-label">
          <span>Email <span className="signup-required">*</span></span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
            disabled={isLoading}
            className={`signup-input${errors.email ? " signup-input-error" : ""}`}
            placeholder="you@example.com"
          />
          {errors.email && <span className="signup-field-error">{errors.email}</span>}
        </label>

        <label className="signup-label">
          <span>Phone number <span className="signup-required">*</span></span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: "" })); }}
            disabled={isLoading}
            className={`signup-input${errors.phone ? " signup-input-error" : ""}`}
            placeholder="(818) 555-0100"
          />
          {errors.phone && <span className="signup-field-error">{errors.phone}</span>}
        </label>

        <label className="signup-label">
          <span>Business name <span className="signup-optional">(optional)</span></span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className="signup-input"
            placeholder="Your business name"
          />
        </label>

        {/* Honeypot spam filter */}
        <input type="checkbox" name="botcheck" style={{ display: "none" }} />

        <button
          type="submit"
          className="btn btn-primary signup-submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending…" : "Sign up"}
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
