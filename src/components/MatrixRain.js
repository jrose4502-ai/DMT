import React, { useEffect, useRef } from "react";
import "./MatrixRain.css";

const CHARS =
  "?????????????????????????????????????????????0123456789ABCDEF|:ÿ.*+-<>";

const MatrixRain = ({
  disabled = false,
  staticMode = false,
  liteMode = true,
  frameMsOverride,
  dprCap = 2,
  mobileFontSize = 12,
  desktopFontSize = 15,
  columnStep = 1,
}) => {
  const canvasRef = useRef(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (disabled) return undefined;
    // Still render the canvas even with reduced-motion; CSS opacity keeps it hidden until hover.

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let drops = [];
    let fontSize = 15;
    let w = 0;
    let h = 0;
    let frameMs = frameMsOverride ?? 48;
    let intervalId;
    let drawPhase = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = w < 768 ? mobileFontSize : desktopFontSize;
      const columns = Math.ceil(w / fontSize);
      drops = Array(columns)
        .fill(0)
        .map(() => Math.floor(Math.random() * -50));

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      frameMs = frameMsOverride ?? (w < 768 || coarse ? 72 : 48);

      if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(draw, frameMs);
      }
    };

    const draw = () => {
      if (!w || !h || docHidden) return;
      ctx.fillStyle = liteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
      const baseStep = Math.max(1, Number(columnStep) || 1);
      const step = liteMode ? Math.max(2, baseStep) : baseStep;
      for (let i = 0; i < drops.length; i++) {
        if (step > 1 && i % step !== drawPhase) continue;
        const charIndex =
          ((drops[i] + i * 7 + drawPhase) % CHARS.length + CHARS.length) %
          CHARS.length;
        const text = CHARS[charIndex];
        const y = drops[i] * fontSize;
        ctx.fillStyle = (i + drawPhase) % 13 === 0
          ? "rgba(255, 215, 106, 0.86)"
          : "rgba(230, 184, 76, 0.48)";
        ctx.fillText(text, i * fontSize, y);
        if (y > h && (drops[i] + i) % 9 === 0) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
      if (step > 1) {
        drawPhase = (drawPhase + 1) % step;
      }
    };

    const drawStatic = () => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
      for (let i = 0; i < drops.length; i++) {
        const text = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = Math.floor(Math.random() * h);
        ctx.fillStyle =
          Math.random() > 0.94
            ? "rgba(255, 215, 106, 0.78)"
            : "rgba(230, 184, 76, 0.35)";
        ctx.fillText(text, i * fontSize, y);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let docHidden = document.hidden;
    const onVisibility = () => {
      docHidden = document.hidden;
      if (!docHidden && staticMode) drawStatic();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (staticMode) {
      drawStatic();
    } else {
      intervalId = setInterval(draw, frameMs);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    disabled,
    staticMode,
    liteMode,
    columnStep,
    desktopFontSize,
    dprCap,
    frameMsOverride,
    mobileFontSize,
    reducedMotion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      aria-hidden="true"
      style={disabled ? { display: "none" } : undefined}
    />
  );
};

export default MatrixRain;
