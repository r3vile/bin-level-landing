"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  ports: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name || data.name.length < 2) errors.name = "Bitte geben Sie Ihren Namen ein.";
  if (!data.company) errors.company = "Bitte geben Sie Ihr Unternehmen ein.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (data.phone && !/^[+\d\s()-]{6,}$/.test(data.phone))
    errors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
  if (!data.message || data.message.length < 10)
    errors.message = "Bitte geben Sie eine Nachricht ein (mind. 10 Zeichen).";
  return errors;
}

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    ports: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", company: "", email: "", phone: "", ports: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="kontakt" className="relative py-32 lg:py-40 bg-bg-secondary noise-bg overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_70%_50%,rgba(245,158,11,0.04),transparent)]" />

      <div ref={ref} className="max-w-container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left column */}
          <div className={`animate-fade-in-left ${isVisible ? "visible" : ""}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-6">
              Kontakt
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Lassen Sie uns über Ihr System sprechen.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-10">
              In einem kurzen Gespräch prüfen wir gemeinsam, ob und wie Bin Level an Ihrem AutoStore funktionieren kann.
            </p>

            <div className="space-y-5 mb-12">
              {[
                "Unverbindliches Erstgespräch",
                "Technische Machbarkeitsprüfung für Ihr Setup",
                "Transparente Preisgestaltung",
              ].map((benefit, i) => (
                <div
                  key={benefit}
                  className={`flex items-center gap-4 animate-fade-in-left ${isVisible ? "visible" : ""}`}
                  style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a href="mailto:info@binlevel.de" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-medium group">
                info@binlevel.de
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <p className="text-text-muted/50 text-sm">Antwort innerhalb von 24 Stunden</p>
            </div>
          </div>

          {/* Right column: Form */}
          <div className={`animate-fade-in-right ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-b from-accent/[0.08] to-transparent rounded-3xl blur-xl" />
              <div className="relative glass-card rounded-3xl p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Beratungsgespräch anfragen</h3>
                <p className="text-text-muted/60 text-sm mb-8">Unverbindlich und kostenlos. Wir melden uns innerhalb von 24h.</p>

                {status === "success" ? (
                  <div className="text-center py-16 animate-scale-in visible">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-white text-xl font-semibold mb-2">Vielen Dank für Ihre Anfrage!</p>
                    <p className="text-text-muted">
                      Wir melden uns innerhalb von 24 Stunden bei Ihnen, um einen Termin für Ihr Beratungsgespräch zu finden.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        label="Ihr Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                      />
                      <FormField
                        label="Unternehmen"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        error={errors.company}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        label="E-Mail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />
                      <FormField
                        label="Telefon (optional)"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                      />
                    </div>

                    {/* Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-text-muted/80 mb-2">
                        Anzahl AutoStore-Ports
                      </label>
                      <select
                        name="ports"
                        value={formData.ports}
                        onChange={handleChange}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-[15px] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="1-5">1–5</option>
                        <option value="6-10">6–10</option>
                        <option value="11-20">11–20</option>
                        <option value="20+">20+</option>
                      </select>
                    </div>

                    {/* Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-text-muted/80 mb-2">
                        Ihre Nachricht
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 text-white text-[15px] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300 resize-none ${
                          errors.message ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-accent hover:bg-accent-hover text-text-dark font-semibold text-base rounded-full px-6 py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Wird gesendet...
                        </span>
                      ) : (
                        "Kostenlos beraten lassen"
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center">
                        Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                      </p>
                    )}

                    <p className="text-text-muted/40 text-xs text-center pt-1">
                      Unverbindlich und kostenlos. Keine versteckten Kosten.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-muted/80 mb-2">
        {label}
        {required && <span className="text-accent/60 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 text-white text-[15px] placeholder:text-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300 ${
          error ? "border-red-500/50" : "border-white/[0.08]"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
