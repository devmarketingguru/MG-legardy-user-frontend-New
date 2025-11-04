import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-thai)", "Noto Sans Thai", "system-ui", "sans-serif"],
        heading: ["var(--font-noto-sans-thai)", "Noto Sans Thai", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3366FF",
          foreground: "#EFF4FF",
          50: "#F5F7FF",
          100: "#E6EDFF",
          200: "#CEDCFF",
          300: "#A6C0FF",
          400: "#7E9EFF",
          500: "#567EFF",
          600: "#3366FF",
          700: "#264FCC",
          800: "#1C3E99",
          900: "#142C6B",
        },
        accent: {
          DEFAULT: "#EEF2FF",
          foreground: "#1E3A8A",
        },
        muted: {
          DEFAULT: "#E2E8F7",
          foreground: "#64748B",
        },
        border: "rgba(148, 163, 184, 0.32)",
        background: "#F6F8FE",
        foreground: "#0F172A",
        card: "#FFFFFF",
        "card-foreground": "#0F172A",
      },
      borderRadius: {
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
      },
      boxShadow: {
        card: "0 30px 65px -36px rgba(30, 64, 175, 0.45), 0 18px 30px -20px rgba(15, 23, 42, 0.12)",
        elevated: "0 45px 90px -45px rgba(30, 64, 175, 0.55)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, rgba(51, 102, 255, 0.12) 0%, rgba(79, 70, 229, 0.08) 60%, rgba(14, 165, 233, 0.1) 100%)",
      },
    },
  },
  plugins: [forms, tailwindcssAnimate],
};

export default config;