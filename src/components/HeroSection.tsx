"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AutoStoreGrid from "@/components/icons/AutoStoreGrid";

export default function HeroSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-bg-primary overflow-hidden">
      {/* Dot matrix background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #F1F5F9 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        ref={ref}
        className="max-w-container mx-auto px-6 py-16 lg:py-24 relative z-10"
      >
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column (3/5) */}
          <div className={`lg:col-span-3 animate-fade-in-left ${isVisible ? "visible" : ""}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-tight text-white mb-6">
              Ihr AutoStore ist voller als Sie denken — nur nicht mit Ware.
            </h1>
            <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-xl">
              Bis zu 40% mehr Kapazität aus Ihrem bestehenden System — ohne
              Erweiterung, ohne Downtime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="#kontakt"
                onClick={(e) => handleScroll(e, "#kontakt")}
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-text-dark font-bold text-base rounded-lg transition-colors"
              >
                Demo anfragen
              </a>
              <a
                href="#problem"
                onClick={(e) => handleScroll(e, "#problem")}
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white hover:bg-white/5 font-medium text-base rounded-lg transition-colors"
              >
                Mehr erfahren
              </a>
            </div>

            <p className="text-sm text-text-muted">
              Bereits im Einsatz bei führenden E-Commerce-Unternehmen
            </p>
          </div>

          {/* Right column (2/5) */}
          <div className={`lg:col-span-2 animate-fade-in-right ${isVisible ? "visible" : ""}`}>
            <AutoStoreGrid className="w-full h-auto max-w-md lg:max-w-lg mx-auto" />
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-bg-secondary/80 backdrop-blur-sm border-t border-line/30">
        <div className="max-w-container mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <TrustBadge icon="↑" text="40% mehr Kapazität" />
            <TrustBadge icon="⏱" text="< 1 Tag Installation" />
            <TrustBadge icon="🛡" text="0% Downtime" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 border border-line/50 rounded-full">
      <span className="text-accent text-lg">{icon}</span>
      <span className="text-sm font-medium text-text-light whitespace-nowrap">{text}</span>
    </div>
  );
}
