"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    num: "01",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
    title: "Bin Level System installieren",
    body: "Wir liefern ein fertiges Sensorsystem für Ihre Ports. Die Montage erfolgt am bestehenden Port — kein Eingriff ins AutoStore-System, kein Stillstand.",
  },
  {
    num: "02",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: "Füllstand erfassen",
    body: "Bei jedem Bin-Durchlauf am Port misst der ToF-Sensor den verfügbaren Platz und speichert den Wert automatisch.",
  },
  {
    num: "03",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: "Füllstand zurückschreiben",
    body: "Der ermittelte Füllstand wird direkt als Kategorie-Code in AutoStore geschrieben. Sofort nutzbar — ganz ohne WMS-Anpassung.",
  },
];

const features = [
  "Alle Port-Typen",
  "Echtzeit-Dashboard",
  "REST API",
  "Made in Germany",
];

export default function SolutionSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();
  const { ref: modesRef, isVisible: modesVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  return (
    <section id="loesung" className="relative py-32 lg:py-40 bg-surface-light overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.04),transparent)]" />

      <div className="max-w-container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-20 lg:mb-24 animate-fade-in-up ${headerVisible ? "visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-hover text-xs font-semibold uppercase tracking-[0.15em] mb-6">
            So funktioniert es
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Drei Schritte zum Füllstand.
            <br />
            <span className="text-text-dark/50">Nachrüstbar an jedem AutoStore-Port.</span>
          </h2>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="grid md:grid-cols-3 gap-8 lg:gap-6 mb-20 relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20" />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`group text-center relative animate-fade-in-up ${stepsVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Number */}
              <div className="relative inline-block mb-6">
                <span className="text-6xl lg:text-7xl font-bold font-mono text-gradient tracking-tight">
                  {step.num}
                </span>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white shadow-premium mx-auto mb-5 flex items-center justify-center text-text-dark/60 transition-all duration-500 group-hover:shadow-premium-lg group-hover:scale-105">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-text-dark mb-3 tracking-tight">{step.title}</h3>
              <p className="text-text-dark/50 text-[15px] leading-relaxed max-w-[280px] mx-auto">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Two integration modes */}
        <div
          ref={modesRef}
          className={`grid md:grid-cols-2 gap-5 mb-16 animate-fade-in-up ${modesVisible ? "visible" : ""}`}
        >
          {/* Mode A: Standalone */}
          <div className="relative bg-white rounded-2xl p-7 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-2 border-accent/30">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-text-dark text-xs font-bold rounded-full">
              Standard
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark tracking-tight">Ohne WMS-Integration</h3>
                <p className="text-text-dark/50 text-[15px] leading-relaxed mt-1.5">
                  Der Füllstand wird als Kategorie-Code direkt in AutoStore geschrieben. Ihr bestehendes System nutzt die Daten sofort — ohne jede Anpassung am WMS.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dark/40 ml-14">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Kein IT-Projekt nötig
            </div>
          </div>

          {/* Mode B: WMS Integration */}
          <div className="bg-white rounded-2xl p-7 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-text-dark/5 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-text-dark/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark tracking-tight">Optional: WMS-Anbindung</h3>
                <p className="text-text-dark/50 text-[15px] leading-relaxed mt-1.5">
                  Füllstandsdaten können zusätzlich per REST API an Ihr WMS übertragen werden. Für volle Kontrolle über Einlagerungs&shy;strategien nach verfügbarem Volumen.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dark/40 ml-14">
              <svg className="w-3.5 h-3.5 text-text-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Kompatibel mit JTL, SAP, Descartes, u.a.
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div
          ref={featuresRef}
          className={`pt-12 border-t border-text-dark/[0.06] animate-fade-in-up ${featuresVisible ? "visible" : ""}`}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-sm text-text-dark/70 font-medium transition-all duration-300 hover:shadow-premium hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
