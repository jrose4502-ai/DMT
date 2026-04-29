import React from 'react';
import '../styles/Pricing.css';

const Pricing = () => {
  const packages = [
    {
      title: 'Starter Package',
      subtitle: 'Perfect for businesses just getting started',
      price: '$500 - $1,000',
      features: [
        'Professional Website Design',
        'Mobile Optimization',
        'Basic SEO Setup',
        'Contact Form Integration'
      ],
      highlight: false
    },
    {
      title: 'Growth Package',
      subtitle: 'For businesses ready to attract more customers',
      price: '$1,000 - $2,500',
      features: [
        'Everything in Starter',
        'Advanced SEO Optimization',
        'Social Media Setup / Optimization',
        'Lead Generation Strategy'
      ],
      highlight: true
    },
    {
      title: 'Premium Package',
      subtitle: 'For businesses ready to scale and dominate online',
      price: '$2,500+',
      features: [
        'Everything in Growth',
        'Paid Ads Setup & Management',
        'Conversion Optimization',
        'Ongoing Marketing Strategy',
        'Monthly Performance Tracking'
      ],
      highlight: false
    },
    {
      title: 'Monthly Marketing Plans',
      subtitle: 'If you want consistent growth without handling everything yourself',
      price: '$500/month',
      priceNote: '(custom based on needs)',
      features: [
        'SEO Management',
        'Social Media Management',
        'Paid Ads Management',
        'Website Updates & Maintenance'
      ],
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Flexible Pricing That Works for You</h2>
          <p className="section-subtitle">
            Our goal is simple: help you grow your business without unnecessary stress or wasted money.
          </p>
        </div>

        <div className="pricing-grid">
          {packages.map((pkg, index) => (
            <div className={`pricing-card ${pkg.highlight ? 'highlight' : ''}`} key={index}>
              {pkg.highlight && <div className="popular-tag">Most Popular</div>}
              <div className="pricing-header">
                <h3>{pkg.title}</h3>
                <p className="pkg-subtitle">{pkg.subtitle}</p>
                <div className="price">
                  <span className="currency">💰</span>
                  <span className="amount">{pkg.price}</span>
                  {pkg.priceNote && <p className="price-note">{pkg.priceNote}</p>}
                </div>
              </div>
              <ul className="pricing-features">
                {pkg.features.map((feature, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`btn ${pkg.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                Choose {pkg.title}
              </a>
            </div>
          ))}
        </div>

        <div className="custom-packages-box">
          <div className="custom-content">
            <div className="custom-text">
              <h3>Custom Packages</h3>
              <p>
                Not every business fits into a box, and we get that. Whether your budget is smaller or you’re ready to go all-in, we’ll build a custom plan that works specifically for you.
              </p>
              <p className="budget-note">
                If you see a package that fits your needs but feels outside your budget, don’t let that stop you. Reach out to us.
              </p>
            </div>
            <div className="custom-cta">
              <a href="#contact" className="btn btn-primary">Get a Custom Quote</a>
            </div>
          </div>
        </div>

        <div className="why-work-with-us">
          <h3 className="why-title">Why Work With Us</h3>
          <div className="why-grid">
            <div className="why-item">
              <i className="fas fa-users"></i>
              <h4>Built for large and small businesses</h4>
            </div>
            <div className="why-item">
              <i className="fas fa-magic"></i>
              <h4>Custom strategies, not templates</h4>
            </div>
            <div className="why-item">
              <i className="fas fa-chart-line"></i>
              <h4>Focused on real results</h4>
            </div>
            <div className="why-item">
              <i className="fas fa-comments"></i>
              <h4>Clear communication, no guesswork</h4>
            </div>
          </div>
          <p className="why-footer-text">
            When you invest in your business, you should see it grow. That’s what we’re here to make happen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
