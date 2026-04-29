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
            Digital Marketing Built to Grow Your Business
          </h1>
          <p className="hero-subtitle">
            We create premium websites, powerful marketing strategies, and
            conversion-focused campaigns designed to help your business stand
            out, attract customers, and scale with confidence.
          </p>
          <div className="hero-cta">
            <button
              type="button"
              onClick={() => scrollToSection('services')}
              className="btn btn-primary btn-lg"
            >
              Explore Our Solutions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="btn btn-secondary btn-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
