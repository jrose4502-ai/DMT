import React from 'react';
import '../styles/About.css';
import julianRosarioPhoto from '../assets/images/julian portrait.png';
import angieRossoPhoto from '../assets/images/angie-new.png';

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">SEO and Marketing That Drive Real Growth</h2>
          <p className="section-subtitle">
            From custom websites to SEO and paid ads, Digital Marketrix helps business owners build a stronger online presence and generate more revenue.
          </p>
        </div>

        <div className="about-intro">
          <p>
            Based in the heart of Los Angeles, Digital Marketrix was built with one goal in mind, helping businesses grow, stand out, and make more money online.
          </p>
          <p>
            Founded by Julian Rosario and Angie Rosso, we combine real-world hustle with modern digital strategy. We understand how overwhelming running a business can be, especially when it comes to your online presence. That's why our mission goes beyond marketing, we're here to take that stress off your plate and turn it into results you can actually see.
          </p>
          <p>
            We specialize in creating high-quality, conversion-focused websites that don't just look good, they work. Your website should be your best salesperson, bringing in customers 24/7, not something that confuses or turns people away. That's exactly what we build.
          </p>
          <p>
            On top of that, we handle everything from SEO to paid ads and social media, so you don't have to worry about figuring it all out yourself. No guesswork, no wasted time, just clear strategy and real growth.
          </p>
          <p>
            If your business feels stuck, overlooked, or you're tired of stressing about how to get more customers online, that's where we come in.
          </p>
          <p>
            We're not just a marketing agency, we're the solution to turning your online presence into consistent revenue, without the headache.
          </p>
        </div>

        <div className="founders-section">
          <h3 className="founders-title">Meet Our Founders</h3>
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-image-wrap">
                <img
                  src={julianRosarioPhoto}
                  alt="Julian Rosario"
                  className="founder-image"
                />
              </div>
              <div className="founder-info">
                <h4>Julian Rosario</h4>
                <p className="founder-role">Co-Founder</p>
              </div>
            </div>
            <div className="founder-card">
              <div className="founder-image-wrap">
                <img
                  src={angieRossoPhoto}
                  alt="Angie Rosso"
                  className="founder-image"
                />
              </div>
              <div className="founder-info">
                <h4>Angie Rosso</h4>
                <p className="founder-role">Co-Founder</p>
              </div>
            </div>
          </div>
        </div>

        <div className="approach-section">
          <h3 className="approach-title">Our Approach</h3>
          <p className="approach-intro">
            We build from the bottom line up. First, we design an offer that your customers actually want. Then we launch fast, test weekly, and scale what works.
          </p>
          <div className="approach-grid">
            <div className="approach-card">
              <div className="approach-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h4>Data-Driven Decisions</h4>
              <p>
                Every decision is tied to data you can see: leads, calls, bookings, and revenue.
              </p>
            </div>
            <div className="approach-card">
              <div className="approach-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h4>Fast Launch & Test</h4>
              <p>
                We launch quickly, test weekly, and continuously optimize what works best for your business.
              </p>
            </div>
            <div className="approach-card">
              <div className="approach-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>You Own Everything</h4>
              <p>
                You own the accounts, the assets, and the results. Complete transparency and control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
