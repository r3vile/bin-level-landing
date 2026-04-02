"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function CookieBanner() {
  const [consent, setConsent, hydrated] = useLocalStorage<string | null>("cookie-consent", null);

  if (!hydrated || consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-line p-4 lg:p-6">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted text-center sm:text-left">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.
          Weitere Informationen finden Sie in unserer{" "}
          <a href="/datenschutz" className="text-accent hover:text-accent-hover underline">
            Datenschutzerklärung
          </a>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setConsent("declined")}
            className="px-5 py-2 border border-line rounded-lg text-sm text-text-muted hover:text-white hover:border-white/30 transition-colors"
          >
            Ablehnen
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="px-5 py-2 bg-accent hover:bg-accent-hover text-text-dark font-bold text-sm rounded-lg transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
