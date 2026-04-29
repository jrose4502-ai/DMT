import React, { lazy, Suspense, useEffect, useState } from "react";

const SplashCursor = lazy(() => import("./SplashCursor"));

/**
 * Defers loading the WebGL splash cursor until the browser is idle so main-thread
 * work for LCP/FCP stays prioritized. Skipped entirely when reduced motion is requested.
 */
export default function DeferredSplashCursor(props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 2200,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <SplashCursor {...props} />
    </Suspense>
  );
}
