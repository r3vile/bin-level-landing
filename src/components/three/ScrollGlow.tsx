"use client";

import { useRef, useEffect, useState } from "react";

/**
 * A CSS-driven scroll-linked atmospheric glow that transitions
 * between sections. Uses a radial gradient that shifts position
 * and intensity based on scroll progress. Light-weight, no Three.js.
 */
export default function ScrollGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

  // Gradient shifts as you scroll — amber glow moves and morphs
  const xPos = 50 + Math.sin(progress * Math.PI * 2) * 20;
  const yPos = 30 + progress * 40;
  const size = 30 + Math.sin(progress * Math.PI) * 20;
  const opacity = 0.04 + Math.sin(progress * Math.PI) * 0.03;

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(ellipse ${size}% ${size * 0.7}% at ${xPos}% ${yPos}%, rgba(245, 158, 11, ${opacity}), transparent)`,
        transition: "background 0.3s ease-out",
      }}
    />
  );
}
