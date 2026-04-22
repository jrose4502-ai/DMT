import React from 'react';
import './App.css';
import Plasma from './components/Plasma';
import MatrixRain from './components/MatrixRain';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SplashCursor from './components/SplashCursor';

function App() {
  return (
    <div className="App app-matrix">
      <div className="app-plasma-background" aria-hidden="true">
        <Plasma
          color="#c9a44d"
          speed={0.55}
          direction="forward"
          scale={1.08}
          opacity={0.75}
          mouseInteractive={false}
        />
      </div>
      <MatrixRain />
      <SplashCursor
        DENSITY_DISSIPATION={10}
        VELOCITY_DISSIPATION={1.5}
        PRESSURE={0}
        CURL={0}
        SPLAT_RADIUS={0.01}
        SPLAT_FORCE={1000}
        COLOR_UPDATE_SPEED={1}
        SHADING={false}
        RAINBOW_MODE={false}
        COLOR="#FFD700"
      />
      <div className="app-matrix-foreground">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Contact />
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default App;
