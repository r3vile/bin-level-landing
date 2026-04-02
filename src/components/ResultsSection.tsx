"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

const metrics = [
  { target: 40, suffix: "%", label: "mehr Auslastung", sublabel: "im Referenzprojekt SportFits" },
  { target: 1, prefix: "< ", suffix: " Tag", label: "Installation", sublabel: "pro Port, ohne Stillstand" },
  { target: 0, suffix: "", label: "Eingriffe ins System", sublabel: "reine Nachrüstung am Port" },
];

const trustBadges = [
  { icon: "🇩🇪", text: "Made in Germany" },
  { icon: "🛡", text: "DSGVO-konform" },
  { icon: "⊞", text: "Kompatibel mit gängigen AutoStore-Konfigurationen" },
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
      className={`group glass-card rounded-2xl p-8 lg:p-10 text-center transition-all duration-500 ease-apple hover:shadow-premium hover:border-white/10 hover:-translate-y-1 animate-scale-in ${trigger ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <p className="text-gradient text-5xl lg:text-7xl font-bold font-mono mb-4 tracking-tight">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="text-white text-lg font-semibold mb-1">{label}</p>
      <p className="text-text-muted/70 text-sm">{sublabel}</p>
    </div>
  );
}

export default function ResultsSection() {
  const { ref: metricsRef, isVisible: metricsVisible } = useScrollAnimation();
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollAnimation();
  const { ref: badgesRef, isVisible: badgesVisible } = useScrollAnimation();

  return (
    <section id="ergebnisse" className="relative py-32 lg:py-40 bg-bg-primary noise-bg overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 animate-fade-in-up ${metricsVisible ? "visible" : ""}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-6">
            Referenzprojekt
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto">
            <span className="text-gradient-white">Im Einsatz bei SportFits.</span>
            <br />
            <span className="text-text-muted">12.000 Bins. Messbar bessere Auslastung.</span>
          </h2>
        </div>

        {/* Metric cards */}
        <div ref={metricsRef} className="grid md:grid-cols-3 gap-5 mb-20">
          {metrics.map((metric, i) => (
            <MetricCard
              key={i}
              {...metric}
              trigger={metricsVisible}
              delay={i * 0.12}
            />
          ))}
        </div>

        {/* Testimonial */}
        <div
          ref={quoteRef}
          className={`relative glass-card rounded-3xl p-8 lg:p-12 mb-20 animate-scale-in ${quoteVisible ? "visible" : ""}`}
        >
          {/* Subtle glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/[0.05] via-transparent to-accent/[0.05] rounded-3xl blur-xl" />

          <div className="relative grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <svg className="w-10 h-10 text-accent/40 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <blockquote className="text-white text-xl lg:text-2xl font-medium italic leading-relaxed mb-8">
                &ldquo;Durch Bin Level wissen wir erstmals, wie voll unsere Bins tatsächlich sind.
                Die Daten zeigten, dass wir deutlich mehr Kapazität im bestehenden System hatten als gedacht.&rdquo;
              </blockquote>
              <p className="text-text-muted font-medium">— Geschäftsführung, SportFits GmbH</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-xs text-text-muted/80"
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
          className={`flex flex-wrap justify-center gap-8 lg:gap-12 animate-fade-in-up ${badgesVisible ? "visible" : ""}`}
        >
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2.5 text-text-muted/60 text-sm transition-colors duration-300 hover:text-text-muted">
              <span className="text-base">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
