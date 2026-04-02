import Link from "next/link";
import Logo from "@/components/icons/Logo";

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-line">
      <div className="max-w-container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/impressum" className="hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">
              Datenschutz
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            Made with ❤️ in Germany
          </p>
        </div>

        <div className="border-t border-line pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2026 Bin Level. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-text-muted text-center max-w-2xl">
            AutoStore™ ist eine eingetragene Marke der AutoStore Technology AS.
            Bin Level ist ein unabhängiges Drittanbieter-Produkt.
          </p>
        </div>
      </div>
    </footer>
  );
}
