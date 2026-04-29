import React from 'react';
import '../styles/Services.css';
import adImage from '../assets/images/scale ur buisness new.png';
import BorderGlow from './BorderGlow';
import iconLaptop from '../assets/images/lap top new icon.png';
import iconRocket2 from '../assets/images/rocket for new icon.png';
import iconMagnify from '../assets/images/maginify glass for new icon.png';
import iconChart from '../assets/images/chart for new icon.png';

const Services = () => {
  const services = [
    {
      icon: iconLaptop,
      title: 'Web Design & Development',
      description:
        'Build stunning, responsive websites that convert visitors into customers. High-quality, conversion-focused design that works 24/7.',
      features: [
        'Custom Website Design',
        'E-commerce Solutions',
        'Mobile Optimization',
        'Maintenance & Support',
      ],
    },
    {
      icon: iconRocket2,
      title: 'Digital Marketing Strategy',
      description:
        'Data-driven plans that grow your brand, reach the right audience, and improve ROI across channels.',
      features: [
        'Campaign & content strategy',
        'Multi-channel growth',
        'Brand positioning',
        'Performance reporting',
      ],
    },
    {
      icon: iconMagnify,
      title: 'SEO & Visibility',
      description:
        'Boost visibility and organic traffic with technical SEO, on-page optimization, and measurable results.',
      features: [
        'Keyword Research',
        'On-Page Optimization',
        'Technical SEO',
        'Link Building',
      ],
    },
    {
      icon: iconChart,
      title: 'Analytics & Optimization',
      description:
        'Make data-driven decisions with dashboards, testing, and reporting that tie effort to revenue.',
      features: [
        'Performance Tracking',
        'Custom Dashboards',
        'CRO & A/B Testing',
        'ROI Analysis',
      ],
    },
  ];

  return (
    <section id="services" className="services section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Transformative Digital Services</h2>
          <p className="section-subtitle">
            From concept to conversion, we craft bespoke, data-driven digital experiences that elevate brands and dominate markets nationwide.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <BorderGlow
              key={index}
              className="service-card"
              edgeSensitivity={30}
              glowColor="43 42% 62%"
              backgroundColor="rgba(10, 9, 8, 0.94)"
              borderRadius={14}
              glowRadius={38}
              glowIntensity={1.02}
              coneSpread={22}
              animated={false}
              colors={['#d4bc7a', '#f0e8dc', '#9d7a35']}
              fillOpacity={0.38}
            >
              <div className="service-card-inner">
                <div className="service-icon">
                  <img src={service.icon} alt="" className="service-icon-img" />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-hover-overlay">
                  <h4>What&apos;s Included:</h4>
                  <ul className="service-features-hover">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>

        <div className="services-ad-banner">
          <img
            src={adImage}
            alt="Scale your business with Digital Marketrix"
            className="ad-image"
            width="1024"
            height="582"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
