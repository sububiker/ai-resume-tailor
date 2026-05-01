import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7c3aed",
          blue: "#3b82f6",
          dark: "#0a0a0f",
          card: "#111118",
          border: "#1e1e2e",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "count-up": "countUp 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
