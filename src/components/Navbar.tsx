"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/icons/Logo";

const navLinks = [
  { label: "Herausforderung", href: "#problem" },
  { label: "So funktioniert's", href: "#loesung" },
  { label: "Referenz", href: "#ergebnisse" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-container mx-auto px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative px-4 py-2 text-text-muted hover:text-white transition-colors duration-300 text-sm font-medium rounded-full hover:bg-white/[0.06]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#kontakt"
          onClick={(e) => handleNavClick(e, "#kontakt")}
          className="hidden md:inline-flex items-center px-5 py-2.5 bg-accent hover:bg-accent-hover text-text-dark font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
        >
          Beratung anfragen
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-full hover:bg-white/[0.06] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ease-apple origin-center ${
              menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ease-apple ${
              menuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ease-apple origin-center ${
              menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-apple overflow-hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-1 bg-bg-primary/95 backdrop-blur-xl border-t border-white/[0.05]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-text-muted hover:text-white transition-colors duration-300 text-lg font-medium py-3 px-4 rounded-xl hover:bg-white/[0.04]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={(e) => handleNavClick(e, "#kontakt")}
            className="inline-flex items-center justify-center px-5 py-3.5 bg-accent hover:bg-accent-hover text-text-dark font-semibold text-sm rounded-full transition-all duration-300 mt-4"
          >
            Beratung anfragen
          </a>
        </div>
      </div>
    </nav>
  );
}
