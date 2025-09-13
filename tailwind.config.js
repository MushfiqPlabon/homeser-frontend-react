// tailwind.config.js
// This file configures Tailwind CSS for the HomeSer frontend.
// It defines paths to scan for Tailwind classes (content), customizes the default theme
// (e.g., adding custom colors), and includes any Tailwind plugins.

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 10px 40px rgba(31, 38, 135, 0.2)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
