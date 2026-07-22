import type { Config } from "tailwindcss";

/**
 * Paleta de marca Corporación CPI.
 * Base: azul marino profundo del logo (#08053E). Acentos: champán/dorado premium
 * y azul corporativo. Estados de disponibilidad accesibles (no dependen solo del color).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Marca
        navy: {
          DEFAULT: "#08053E",
          50: "#EEEEF6",
          100: "#D5D5E8",
          600: "#14104F",
          700: "#0E0A45",
          800: "#0A0736",
          900: "#050325",
        },
        gold: {
          DEFAULT: "#C8A961",
          soft: "#E4CF9B",
          deep: "#9A7C3C",
        },
        cpiblue: {
          DEFAULT: "#1F6FEB",
          soft: "#5C93F2",
        },
        // Estados de disponibilidad
        status: {
          available: "#2F9E6E",
          reserved: "#D4A03C",
          sold: "#8A8F98",
          soon: "#5C93F2",
          unavailable: "#4B4F57",
        },
        cream: "#F7F5EF",
        ink: "#1A1A22",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,5,62,0.04), 0 8px 24px rgba(8,5,62,0.06)",
        float: "0 12px 40px rgba(8,5,62,0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease both",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
