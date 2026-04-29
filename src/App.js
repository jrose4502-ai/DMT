import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import Plasma from "./components/Plasma";
import MatrixRain from "./components/MatrixRain";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ScrollToTop from "./components/ScrollToTop";
import DeferredSplashCursor from "./components/DeferredSplashCursor";

const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const Pricing = lazy(() => import("./components/Pricing"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function ConditionalPlasma() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [maxFps, setMaxFps] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onReduce);

    const updateFps = () => {
      const w = window.innerWidth;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      if (w < 480) setMaxFps(20);
      else if (w < 768 || coarse) setMaxFps(28);
      else setMaxFps(0);
    };
    updateFps();
    window.addEventListener("resize", updateFps);

    return () => {
      mq.removeEventListener("change", onReduce);
      window.removeEventListener("resize", updateFps);
    };
  }, []);

  if (reducedMotion) {
    return <div className="app-plasma-fallback" aria-hidden />;
  }

  return (
    <Plasma
      color="#c9a44d"
      speed={0.55}
      direction="forward"
      scale={1.08}
      opacity={0.75}
      mouseInteractive={false}
      maxFps={maxFps}
    />
  );
}

function App() {
  return (
    <div className="App app-matrix">
      <div className="app-plasma-background" aria-hidden="true">
        <ConditionalPlasma />
      </div>
      <MatrixRain />
      <DeferredSplashCursor
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
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Services />
        </Suspense>
        <Suspense fallback={null}>
          <Pricing />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <ScrollToTop />
      </div>
    </div>
  );
}

export default App;
