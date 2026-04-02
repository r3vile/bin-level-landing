"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BinComparison from "@/components/icons/BinComparison";

const problems = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "Kein Füllstand im System",
    body: "Weder AutoStore noch Ihr WMS wissen, wie viel Volumen in einer Bin tatsächlich frei ist.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Einlagerung ohne Volumendaten",
    body: "Ohne Füllstandsinformation werden Bins zufällig angedient — oft solche, die kaum noch Platz haben.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Erweiterung vor Optimierung",
    body: "AutoStore-Erweiterungen sind kapitalintensiv. Bevor Sie investieren, sollten Sie wissen, ob im bestehenden System noch Kapazität steckt.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
      </svg>
    ),
    title: "Manuell nicht skalierbar",
    body: "Füllstände händisch erfassen? Bei tausenden Bins ist das weder wirtschaftlich noch zuverlässig.",
  },
];

export default function ProblemSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: visualRef, isVisible: visualVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: statRef, isVisible: statVisible } = useScrollAnimation();

  return (
    <section id="problem" className="relative py-32 lg:py-40 bg-bg-secondary noise-bg overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-primary to-transparent" />

      <div className="max-w-container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={sectionRef}
          className={`text-center mb-20 lg:mb-24 animate-fade-in-up ${sectionVisible ? "visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-6">
            Das Problem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto">
            <span className="text-gradient-white">AutoStore kennt Bestände.</span>
            <br />
            <span className="text-text-muted">Aber nicht Füllstände.</span>
          </h2>
        </div>

        {/* Bin comparison visual */}
        <div
          ref={visualRef}
          className={`mb-24 lg:mb-32 animate-scale-in ${visualVisible ? "visible" : ""}`}
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-4 bg-accent/[0.03] rounded-3xl blur-2xl" />
            <BinComparison className="w-full h-auto relative" />
          </div>
        </div>

        {/* Problem cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-5 mb-24 lg:mb-32"
        >
          {problems.map((problem, i) => (
            <div
              key={i}
              className={`group glass-card rounded-2xl p-7 lg:p-8 transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-premium hover:border-white/10 animate-fade-in-up ${
                cardsVisible ? "visible" : ""
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-105">
                {problem.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2.5 tracking-tight">{problem.title}</h3>
              <p className="text-text-muted text-[15px] leading-relaxed">{problem.body}</p>
            </div>
          ))}
        </div>

        {/* Big stat */}
        <div
          ref={statRef}
          className={`text-center animate-fade-in-up ${statVisible ? "visible" : ""}`}
        >
          <p className="text-text-muted text-lg mb-4 font-medium">Volumetrische Bin-Auslastung im Referenzprojekt vor Bin Level:</p>
          <p className="text-gradient text-6xl lg:text-7xl font-bold font-mono mb-8 tracking-tight">
            unter 30%
          </p>
          <div className="max-w-sm mx-auto">
            <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-1500 ease-apple"
                style={{ width: statVisible ? "25%" : "0%", transitionDuration: "1.5s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
