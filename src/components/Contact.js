import React from 'react';
import '../styles/Contact.css';
import SignupForm from './SignupForm';

const CALENDLY_URL = "https://calendly.com/jrose4502/30min";

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ready for More Qualified Leads?</h2>
          <p className="section-subtitle">
            Book a strategy call or request your free website audit. We'll map the exact fixes that can turn your site into a consistent lead source.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Book Your Strategy Call
          </a>
        </div>

        <div className="contact-grid contact-grid-main">
          <div className="contact-info-cards">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Location</h3>
              <p>Los Angeles, California</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3>Phone</h3>
              <p>
                <a href="tel:+15595578224">1(559) 557-8224</a>
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>
                <a href="mailto:info@digitalmarketrix.com">info@digitalmarketrix.com</a>
              </p>
              <a
                href="mailto:info@digitalmarketrix.com?subject=Inquiry%20from%20digitalmarketrix.com"
                className="btn btn-secondary btn-sm"
              >
                Send an Email
              </a>
            </div>
          </div>

          <SignupForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;

