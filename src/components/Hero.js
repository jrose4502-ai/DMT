import React from 'react';
import '../styles/Hero.css';
import heroBg from '../assets/images/hero-header-gold.png';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg-wrap">
        <img
            src={heroBg}
            alt=""
            className="hero-bg"
            width="1024"
            height="571"
            fetchpriority="high"
            decoding="async"
          />
        <div className="hero-overlay" aria-hidden="true" />
      </div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            We Build Systems That Bring You Customers Daily
          </h1>
          <p className="hero-subtitle">
            We help local service businesses turn their website into a lead machine
            using conversion-first web design, SEO, and paid traffic systems.
          </p>
          <div className="hero-cta">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="btn btn-primary btn-lg"
            >
              Book Your Strategy Call
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="btn btn-secondary btn-lg"
            >
              Get Free Website Audit
            </button>
          </div>
          <div className="hero-proof-strip" aria-label="Trust and positioning highlights">
            <span>Built for local businesses</span>
            <span>Web + SEO + paid ads under one team</span>
            <span>Focused on qualified leads and revenue</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
