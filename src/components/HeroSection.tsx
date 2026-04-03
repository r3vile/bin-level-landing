"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ScanVisualization = dynamic(() => import("@/components/scan3d"), {
  ssr: false,
  loading: () => <div className="w-full aspect-square" />,
});

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), {
  ssr: false,
});

export default function HeroSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-20 bg-bg-primary overflow-hidden noise-bg">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]" />

      {/* Dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #F1F5F9 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Three.js Particle Field */}
      <ParticleField />

      <div ref={ref} className="max-w-container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column (3/5) */}
          <div className="lg:col-span-3">
            <div
              className={`animate-blur-in ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: "0s" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                Füllstandssensorik für AutoStore
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-extrabold leading-[1.08] tracking-tight mb-8 animate-blur-in ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: "0.1s" }}
            >
              <span className="text-gradient-white">Wissen, wie voll jede Bin wirklich ist.</span>
              <br />
              <span className="text-gradient">Automatisch. In Echtzeit.</span>
            </h1>

            <p
              className={`text-lg sm:text-xl text-text-muted leading-relaxed mb-10 max-w-lg animate-blur-in ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: "0.2s" }}
            >
              Bin Level misst den Füllstand jeder AutoStore-Bin automatisch
              und schreibt ihn direkt ins AutoStore-System. Ohne WMS-Änderung, sofort einsatzbereit.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 mb-8 animate-blur-in ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: "0.3s" }}
            >
              <a
                href="#kontakt"
                onClick={(e) => handleScroll(e, "#kontakt")}
                className="group inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-text-dark font-semibold text-base rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-[0.97]"
              >
                Kostenlos beraten lassen
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="#loesung"
                onClick={(e) => handleScroll(e, "#loesung")}
                className="inline-flex items-center justify-center px-8 py-4 border border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20 font-medium text-base rounded-full transition-all duration-300 active:scale-[0.97]"
              >
                So funktioniert&apos;s
              </a>
            </div>

            <p
              className={`text-sm text-text-muted/60 animate-blur-in ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: "0.4s" }}
            >
              Nachrüstbar. Ohne Downtime. Made in Germany.
            </p>
          </div>

          {/* Right column (2/5) — Scan Animation */}
          <div
            className={`lg:col-span-2 animate-scale-in ${mounted ? "visible" : ""}`}
            style={{ transitionDelay: "0.3s" }}
          >
            <div className="relative aspect-[4/5] max-w-sm lg:max-w-md mx-auto">
              <ScanVisualization className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-secondary/60 to-transparent backdrop-blur-sm border-t border-white/[0.04]">
        <div className="max-w-container mx-auto px-6 py-6">
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 animate-fade-in-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.5s" }}
          >
            <TrustBadge text="Im Einsatz bei SportFits (12.000 Bins)" />
            <TrustBadge text="Made in Germany" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
      <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span className="text-sm font-medium text-text-light/70 whitespace-nowrap">{text}</span>
    </div>
  );
}
