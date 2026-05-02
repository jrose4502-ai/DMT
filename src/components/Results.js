import React from "react";
import "../styles/Results.css";

const CALENDLY_URL = "https://calendly.com/jrose4502/30min";

const Results = () => {
  const wins = [
    {
      title: "Lead Volume Lift",
      summary:
        "After rebuilding funnel structure and CTA flow, local service clients see stronger inbound lead consistency.",
    },
    {
      title: "Higher Search Visibility",
      summary:
        "Technical SEO cleanup plus content targeting helps businesses rank for buying-intent local keywords.",
    },
    {
      title: "Better Ad Efficiency",
      summary:
        "Conversion-focused landing pages paired with tighter targeting improve qualified-call quality from paid traffic.",
    },
  ];

  return (
    <section id="results" className="results section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Proof Before Promises</h2>
          <p className="section-subtitle">
            Every strategy is built around outcomes: more qualified leads, better conversion rates, and clearer ROI visibility.
          </p>
        </div>

        <div className="results-grid">
          {wins.map((item) => (
            <article key={item.title} className="results-card">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>

        <div className="results-cta-wrap">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            See How We Can Get You Leads
          </a>
        </div>
      </div>
    </section>
  );
};

export default Results;
