import Link from "next/link";
import Logo from "@/components/icons/Logo";

export default function Footer() {
  return (
    <footer className="relative bg-bg-primary border-t border-white/[0.04]">
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <Logo />
          <div className="flex items-center gap-8 text-sm">
            <Link href="/impressum" className="text-text-muted/60 hover:text-white transition-colors duration-300">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-text-muted/60 hover:text-white transition-colors duration-300">
              Datenschutz
            </Link>
          </div>
          <p className="text-sm text-text-muted/40">
            Entwickelt in Deutschland
          </p>
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted/40">
            &copy; 2026 Bin Level. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-text-muted/30 text-center max-w-2xl leading-relaxed">
            AutoStore™ ist eine eingetragene Marke der AutoStore Technology AS.
            Bin Level ist ein unabhängiges Drittanbieter-Produkt.
          </p>
        </div>
      </div>
    </footer>
  );
}
