"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BinComparison from "@/components/icons/BinComparison";

const problems = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "Keine Volumendaten im WMS",
    body: "Ihr System weiß welche Artikel in der Bin liegen — aber nicht, wie viel Platz noch frei ist.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Blinde Einlagerung",
    body: "Beim Wareneingang werden zufällige Bins angedient statt derer mit dem meisten freien Platz.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Teure Erweiterung statt Optimierung",
    body: "AutoStore-Erweiterungen kosten 100.000€+. Oft wäre im bestehenden System noch Kapazität.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
      </svg>
    ),
    title: "Manuelle Erfassung unmöglich",
    body: "Füllstände per Klick pflegen? Bei 10.000+ Bins nicht praktikabel.",
  },
];

export default function ProblemSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: statRef, isVisible: statVisible } = useScrollAnimation();

  return (
    <section id="problem" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-container mx-auto px-6">
        {/* Header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 animate-fade-in-up ${sectionVisible ? "visible" : ""}`}
        >
          <span className="inline-block text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Das unsichtbare Problem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight max-w-3xl mx-auto">
            Ihr WMS kennt den Füllstand nicht. Ihr AutoStore auch nicht.
          </h2>
        </div>

        {/* Bin comparison visual */}
        <div className={`mb-20 animate-fade-in-up ${sectionVisible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <BinComparison className="w-full max-w-2xl mx-auto h-auto" />
        </div>

        {/* Problem cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-6 mb-20"
        >
          {problems.map((problem, i) => (
            <div
              key={i}
              className={`bg-surface border border-line rounded-xl p-6 lg:p-8 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up ${
                cardsVisible ? "visible" : ""
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-accent mb-4">{problem.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{problem.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{problem.body}</p>
            </div>
          ))}
        </div>

        {/* Big stat */}
        <div
          ref={statRef}
          className={`text-center animate-fade-in-up ${statVisible ? "visible" : ""}`}
        >
          <p className="text-text-muted text-lg mb-3">Typische Bin-Auslastung:</p>
          <p className="text-accent text-5xl lg:text-6xl font-bold font-mono mb-6">
            nur 22–27%
          </p>
          <div className="max-w-md mx-auto">
            <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                style={{ width: statVisible ? "25%" : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
