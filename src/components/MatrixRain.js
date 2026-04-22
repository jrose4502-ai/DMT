import React, { useEffect, useRef } from "react";
import "./MatrixRain.css";

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF｜:・.*+-<>";

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let intervalId;
    let drops = [];
    let fontSize = 15;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = w < 768 ? 12 : 15;
      const columns = Math.ceil(w / fontSize);
      drops = Array(columns)
        .fill(0)
        .map(() => Math.floor(Math.random() * -50));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!w || !h) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const text = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;
        /* Match header gold — bright champagne “heads”, muted gold stream */
        ctx.fillStyle =
          Math.random() > 0.96
            ? "rgba(248, 238, 218, 0.94)"
            : "rgba(184, 149, 74, 0.52)";
        ctx.fillText(text, i * fontSize, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    intervalId = setInterval(draw, 48);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
