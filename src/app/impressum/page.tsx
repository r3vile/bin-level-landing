import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Bin Level",
};

export default function Impressum() {
  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="max-w-container mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors mb-8"
        >
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Impressum</h1>
        <div className="prose prose-invert max-w-2xl space-y-6 text-text-muted">
          <p className="text-accent font-medium">
            {"{PLATZHALTER: Impressum nach § 5 TMG}"}
          </p>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              {"{PLATZHALTER: Firmenname}"}<br />
              {"{PLATZHALTER: Straße und Hausnummer}"}<br />
              {"{PLATZHALTER: PLZ und Ort}"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Kontakt</h2>
            <p>
              Telefon: {"{PLATZHALTER}"}<br />
              E-Mail: info@binlevel.de
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Vertreten durch</h2>
            <p>{"{PLATZHALTER: Name des Geschäftsführers}"}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Handelsregister</h2>
            <p>
              {"{PLATZHALTER: Registergericht}"}<br />
              {"{PLATZHALTER: Registernummer}"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Umsatzsteuer-ID</h2>
            <p>{"{PLATZHALTER: USt-IdNr.}"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
