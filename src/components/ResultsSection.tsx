"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

const metrics = [
  { target: 40, suffix: "%", label: "mehr Auslastung", sublabel: "im bestehenden System" },
  { target: 6, prefix: "< ", suffix: " Mon.", label: "Amortisation", sublabel: "typische Payback-Zeit" },
  { target: 100, suffix: "k+", label: "EUR gespart", sublabel: "durch verzögerte Erweiterung" },
];

const trustBadges = [
  { icon: "🇩🇪", text: "Made in Germany" },
  { icon: "🛡", text: "DSGVO-konform" },
  { icon: "⊞", text: "Alle AutoStore-Konfigurationen" },
  { icon: "✓", text: "Unabhängiges Drittanbieter-Produkt" },
];

const tags = ["E-Commerce Sportartikel", "12.000 Bins", "12 Roboter", "Salzweg bei Passau", "Integration: Element Logic"];

function MetricCard({
  target,
  prefix,
  suffix,
  label,
  sublabel,
  trigger,
  delay,
}: {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  trigger: boolean;
  delay: number;
}) {
  const value = useCountUp(target, 2000, trigger);

  return (
    <div
      className={`bg-surface border border-line rounded-xl p-8 lg:p-10 text-center animate-fade-in-up ${trigger ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <p className="text-accent text-5xl lg:text-7xl font-bold font-mono mb-3">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="text-white text-lg font-medium mb-1">{label}</p>
      <p className="text-text-muted text-sm">{sublabel}</p>
    </div>
  );
}

export default function ResultsSection() {
  const { ref: metricsRef, isVisible: metricsVisible } = useScrollAnimation();
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollAnimation();
  const { ref: badgesRef, isVisible: badgesVisible } = useScrollAnimation();

  return (
    <section id="ergebnisse" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-container mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 animate-fade-in-up ${metricsVisible ? "visible" : ""}`}>
          <span className="inline-block text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Nachgewiesene Ergebnisse
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight max-w-3xl mx-auto">
            40% mehr Kapazität. Ohne einen einzigen zusätzlichen Bin.
          </h2>
        </div>

        {/* Metric cards */}
        <div ref={metricsRef} className="grid md:grid-cols-3 gap-6 mb-16">
          {metrics.map((metric, i) => (
            <MetricCard
              key={i}
              {...metric}
              trigger={metricsVisible}
              delay={i * 0.15}
            />
          ))}
        </div>

        {/* Testimonial */}
        <div
          ref={quoteRef}
          className={`bg-surface border border-line rounded-2xl p-8 lg:p-12 mb-16 animate-fade-in-up ${quoteVisible ? "visible" : ""}`}
        >
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <svg className="w-10 h-10 text-accent mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <blockquote className="text-white text-lg lg:text-xl italic leading-relaxed mb-6">
                &ldquo;Bin Level hat uns geholfen, unser AutoStore um 40% besser auszulasten.
                Die geplante Erweiterung konnten wir verschieben — das hat erheblich Kosten gespart.&rdquo;
              </blockquote>
              <p className="text-text-muted">— Geschäftsführung, SportFits</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-bg-primary border border-line rounded-full text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div
          ref={badgesRef}
          className={`flex flex-wrap justify-center gap-6 lg:gap-10 animate-fade-in-up ${badgesVisible ? "visible" : ""}`}
        >
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-text-muted text-sm">
              <span className="text-lg">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
