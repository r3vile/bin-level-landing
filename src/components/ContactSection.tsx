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
    <section id="kontakt" className="py-24 lg:py-32 bg-bg-primary">
      <div ref={ref} className="max-w-container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className={`animate-fade-in-left ${isVisible ? "visible" : ""}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              Wie viel ungenutztes Potenzial steckt in Ihrem AutoStore?
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Vereinbaren Sie eine kostenlose Demo und erfahren Sie, wie Bin Level
              Ihre Lagerkapazität maximiert.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Kostenlose Erstanalyse Ihres Systems",
                "Keine Vertragsbindung",
                "Installation ohne Downtime",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-white">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <a href="mailto:info@binlevel.de" className="text-accent hover:text-accent-hover transition-colors font-medium">
                info@binlevel.de
              </a>
              <p className="text-text-muted text-sm">{"{PLATZHALTER: Telefonnummer}"}</p>
            </div>
          </div>

          {/* Right column: Form */}
          <div className={`animate-fade-in-right ${isVisible ? "visible" : ""}`}>
            <div className="bg-surface border border-line rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-8">Demo anfragen</h3>

              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="text-success text-5xl mb-4">✓</div>
                  <p className="text-white text-lg font-medium mb-2">Vielen Dank!</p>
                  <p className="text-text-muted">
                    Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {/* Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Anzahl AutoStore-Ports
                    </label>
                    <select
                      name="ports"
                      value={formData.ports}
                      onChange={handleChange}
                      className="w-full bg-bg-primary border border-line rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none"
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
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Ihre Nachricht
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full bg-bg-primary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none ${
                        errors.message ? "border-red-500" : "border-line"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-accent hover:bg-accent-hover text-text-dark font-bold text-base rounded-lg px-6 py-4 transition-colors disabled:opacity-60"
                  >
                    {status === "loading" ? "Wird gesendet..." : "Kostenlose Demo anfragen"}
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-sm text-center">
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                    </p>
                  )}

                  <p className="text-text-muted text-xs text-center">
                    Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                  </p>
                </form>
              )}
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
      <label className="block text-sm font-medium text-text-muted mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-bg-primary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
          error ? "border-red-500" : "border-line"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
