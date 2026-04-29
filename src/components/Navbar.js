import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import BellaBot from './BellaBot';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const prevOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ['home', 'about', 'services', 'pricing', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'navbar-menu-open' : ''}`}>
        <div className="container navbar-inner">
          <div
            className="navbar-logo"
            onClick={() => scrollToSection('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollToSection("home");
              }
            }}
            aria-label="Digital Marketrix, Home"
          >
            <BrandLogo />
          </div>

          <ul className={`navbar-links ${isOpen ? "navbar-links-open" : ""}`}>
            <li>
              <a
                href="#home"
                className={activeSection === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#services"
                className={activeSection === 'services' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className={activeSection === 'pricing' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="navbar-actions">
            <a
              href="#contact"
              className="navbar-cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Get Started
            </a>
            <button
              type="button"
              className={`navbar-toggle ${isOpen ? 'active' : ''}`}
              onClick={handleToggle}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>
      <BellaBot />
    </>
  );
};

export default Navbar;
