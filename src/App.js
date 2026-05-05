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
const Results = lazy(() => import("./components/Results"));
const Pricing = lazy(() => import("./components/Pricing"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function getPerformanceProfile() {
  if (typeof window === "undefined") {
    return {
      reducedMotion: false,
      tier: "high",
      maxPlasmaFps: 0,
      showPlasma: false,
      showSplashCursor: true,
      showMatrixRain: true,
      matrixStaticMode: false,
      matrixFrameMs: 90,
      matrixDprCap: 1.2,
      matrixMobileFont: 12,
      matrixDesktopFont: 16,
      matrixColumnStep: 2,
      matrixRainSpeed: 3.0,
    };
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;
  const deviceMemory = navigator.deviceMemory ?? 8;
  const cpuCores = navigator.hardwareConcurrency ?? 8;
  const lowCapacityDevice = deviceMemory <= 4 || cpuCores <= 4;

  let tier = "high";
  if (reducedMotion || lowCapacityDevice || width < 480) tier = "low";
  else if (coarse || width < 900 || deviceMemory <= 6 || cpuCores <= 6) {
    tier = "medium";
  }

  if (tier === "low") {
    return {
      reducedMotion,
      tier,
      maxPlasmaFps: 0,
      showPlasma: false,
      showSplashCursor: false,
      showMatrixRain: true,
      matrixStaticMode: false,
      matrixFrameMs: 140,
      matrixDprCap: 1,
      matrixMobileFont: 10,
      matrixDesktopFont: 14,
      matrixColumnStep: 4,
      matrixRainSpeed: 3.2,
    };
  }

  if (tier === "medium") {
    const tabletLike = coarse && width >= 768;
    return {
      reducedMotion,
      tier,
      maxPlasmaFps: tabletLike ? 0 : 24,
      showPlasma: false,
      showSplashCursor: false,
      showMatrixRain: true,
      matrixStaticMode: false,
      matrixFrameMs: tabletLike ? 130 : 105,
      matrixDprCap: tabletLike ? 1 : 1.2,
      matrixMobileFont: 11,
      matrixDesktopFont: tabletLike ? 16 : 15,
      matrixColumnStep: tabletLike ? 4 : 3,
      matrixRainSpeed: tabletLike ? 3.0 : 2.8,
    };
  }

  return {
    reducedMotion,
    tier,
    maxPlasmaFps: 0,
    showPlasma: false,
    showSplashCursor: true,
    showMatrixRain: true,
    matrixStaticMode: false,
    matrixFrameMs: 90,
    matrixDprCap: 1.2,
    matrixMobileFont: 12,
    matrixDesktopFont: 16,
    matrixColumnStep: 2,
    matrixRainSpeed: 3.0,
  };
}

function usePerformanceProfile() {
  const [profile, setProfile] = useState(() => getPerformanceProfile());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onProfileChange = () => setProfile(getPerformanceProfile());
    mq.addEventListener("change", onProfileChange);
    window.addEventListener("resize", onProfileChange);
    window.addEventListener("orientationchange", onProfileChange);

    return () => {
      mq.removeEventListener("change", onProfileChange);
      window.removeEventListener("resize", onProfileChange);
      window.removeEventListener("orientationchange", onProfileChange);
    };
  }, []);

  return profile;
}

function ConditionalPlasma({ reducedMotion, maxFps, disabled }) {
  if (reducedMotion || disabled) {
    return <div className="app-plasma-fallback" aria-hidden />;
  }

  return (
    <Plasma
      color="#E6B84C"
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
  const profile = usePerformanceProfile();

  return (
    <div className="App app-matrix">
      <div className="app-plasma-background" aria-hidden="true">
        <ConditionalPlasma
          reducedMotion={profile.reducedMotion}
          maxFps={profile.maxPlasmaFps}
          disabled={!profile.showPlasma}
        />
      </div>
      <MatrixRain
        disabled={!profile.showMatrixRain}
        staticMode={profile.matrixStaticMode}
        frameMsOverride={profile.matrixFrameMs}
        dprCap={profile.matrixDprCap}
        mobileFontSize={profile.matrixMobileFont}
        desktopFontSize={profile.matrixDesktopFont}
        columnStep={profile.matrixColumnStep}
        rainSpeed={profile.matrixRainSpeed}
      />
      <DeferredSplashCursor
        disabled={!profile.showSplashCursor}
        DENSITY_DISSIPATION={10}
        VELOCITY_DISSIPATION={1.5}
        PRESSURE={0}
        CURL={0}
        SPLAT_RADIUS={0.01}
        SPLAT_FORCE={1000}
        COLOR_UPDATE_SPEED={1}
        SHADING={false}
        RAINBOW_MODE={false}
        color="#E6B84C"
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
          <Results />
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
