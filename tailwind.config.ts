import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0B1221",
        "bg-secondary": "#111827",
        surface: {
          DEFAULT: "#1E293B",
          light: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          light: "#FDE68A",
        },
        "text-light": "#F1F5F9",
        "text-muted": "#94A3B8",
        "text-dark": "#0F172A",
        line: "#334155",
        success: "#10B981",
      },
      maxWidth: {
        container: "1200px",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.16, 1, 0.3, 1)",
        "apple-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
