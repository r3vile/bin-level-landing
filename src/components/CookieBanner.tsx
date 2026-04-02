"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function CookieBanner() {
  const [consent, setConsent, hydrated] = useLocalStorage<string | null>("cookie-consent", null);

  if (!hydrated || consent !== null) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
      <div className="glass-card rounded-2xl p-6 shadow-premium-lg">
        <p className="text-sm text-text-muted leading-relaxed mb-5">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.{" "}
          <a href="/datenschutz" className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors">
            Mehr erfahren
          </a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConsent("declined")}
            className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-full text-sm text-text-muted hover:text-white hover:border-white/20 transition-all duration-300 active:scale-[0.97]"
          >
            Ablehnen
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-text-dark font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.97]"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
