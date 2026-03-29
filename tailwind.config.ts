import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#070b14",
        panel: "#0d1524",
        elevated: "#111b2d",
        line: "#1f314f",
        accent: "#35d0ff",
        success: "#4ade80",
        danger: "#fb7185",
        gold: "#f4c15d"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(53, 208, 255, 0.12)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
