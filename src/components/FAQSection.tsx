"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    q: "Wie funktioniert die Messung technisch?",
    a: "Ein Time-of-Flight Sensor wird über der Port-Öffnung montiert. Bei jedem Bin-Durchlauf misst er per Infrarot-Laufzeitmessung den Abstand zur Oberfläche des Bin-Inhalts und berechnet daraus den prozentualen Füllstand.",
  },
  {
    q: "Muss mein WMS angepasst werden?",
    a: "Nein. Bin Level funktioniert komplett standalone, indem der Füllstand als Kategorie-Code direkt in AutoStore geschrieben wird. Eine optionale WMS-Anbindung per REST API ist möglich, aber nicht erforderlich.",
  },
  {
    q: "Wie lange dauert die Installation?",
    a: "Die Montage des Sensors an einem Port dauert wenige Stunden. Das AutoStore-System muss dafür nicht gestoppt werden — die Installation erfolgt im laufenden Betrieb.",
  },
  {
    q: "Funktioniert es mit meiner AutoStore-Konfiguration?",
    a: "Bin Level ist mit allen gängigen AutoStore-Port-Typen kompatibel, darunter CarouselPort, ConveyorPort und RelayPort. In einem Beratungsgespräch prüfen wir die Kompatibilität mit Ihrem konkreten Setup.",
  },
  {
    q: "Was kostet Bin Level?",
    a: "Die Kosten hängen von der Anzahl der Ports und Ihrer Konfiguration ab. Kontaktieren Sie uns für ein individuelles Angebot — das Erstgespräch ist kostenlos und unverbindlich.",
  },
  {
    q: "Welche Daten werden erhoben und wie werden sie gespeichert?",
    a: "Bin Level erfasst ausschließlich Füllstandsdaten (Abstandsmessungen) — keine personenbezogenen Daten. Alle Daten werden DSGVO-konform in Deutschland verarbeitet.",
  },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 lg:py-32 bg-bg-secondary noise-bg">
      <div className="max-w-container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-14 animate-fade-in-up ${isVisible ? "visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-6">
            Häufige Fragen
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight">
            <span className="text-gradient-white">Noch Fragen?</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-white/[0.06] animate-fade-in-up ${isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-[15px] font-medium text-white group-hover:text-accent transition-colors duration-200 pr-8">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-text-muted/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-apple ${
                    isOpen ? "max-h-60 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-text-muted/70 text-[14px] leading-relaxed pr-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
