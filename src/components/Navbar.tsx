"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/icons/Logo";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Lösung", href: "#loesung" },
  { label: "Ergebnisse", href: "#ergebnisse" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-container mx-auto px-6 flex items-center justify-between h-16 lg:h-20">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-text-muted hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#kontakt"
          onClick={(e) => handleNavClick(e, "#kontakt")}
          className="hidden md:inline-flex items-center px-5 py-2.5 bg-accent hover:bg-accent-hover text-text-dark font-bold text-sm rounded-lg transition-colors"
        >
          Demo anfragen
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-screen bg-bg-primary/98 backdrop-blur-md" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-text-muted hover:text-white transition-colors text-lg font-medium py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={(e) => handleNavClick(e, "#kontakt")}
            className="inline-flex items-center justify-center px-5 py-3 bg-accent hover:bg-accent-hover text-text-dark font-bold text-sm rounded-lg transition-colors mt-2"
          >
            Demo anfragen
          </a>
        </div>
      </div>
    </nav>
  );
}
