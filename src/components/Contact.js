import React from 'react';
import '../styles/Contact.css';
import SignupForm from './SignupForm';

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Let's Get Started</h2>
          <p className="section-subtitle">
            Take the first step and contact us to discuss your marketing and business goals. 
            We'll help turn your online presence into consistent revenue.
          </p>
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
                <a href="tel:8185837263">(818) 583-7263</a>
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

