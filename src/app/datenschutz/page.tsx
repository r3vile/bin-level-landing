import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Bin Level",
};

export default function Datenschutz() {
  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="max-w-container mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors mb-8"
        >
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Datenschutzerklärung</h1>
        <div className="prose prose-invert max-w-2xl space-y-6 text-text-muted">
          <p className="text-accent font-medium">
            {"{PLATZHALTER: Datenschutzerklärung gemäß DSGVO}"}
          </p>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">1. Verantwortlicher</h2>
            <p>
              {"{PLATZHALTER: Firmenname}"}<br />
              {"{PLATZHALTER: Adresse}"}<br />
              E-Mail: info@binlevel.de
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">2. Erhebung und Verarbeitung von Daten</h2>
            <p>
              {"{PLATZHALTER: Beschreibung der Datenerhebung, z.B. bei Nutzung des Kontaktformulars, Server-Logs, etc.}"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">3. Cookies</h2>
            <p>
              Diese Website verwendet einen Cookie zur Speicherung Ihrer Cookie-Einstellungen.
              Es werden keine Tracking-Cookies verwendet, sofern Sie nicht ausdrücklich zustimmen.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">4. Ihre Rechte</h2>
            <p>
              {"{PLATZHALTER: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch}"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">5. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich an:<br />
              E-Mail: info@binlevel.de
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
