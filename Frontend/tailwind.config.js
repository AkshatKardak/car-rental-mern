/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#13c8ec",
        "accent-purple": "#7c3aed",
        "background-light": "#f6f8f8",
        "background-dark": "#0a0a0c",
        glass: "rgba(255, 255, 255, 0.03)",
        "glass-border": "rgba(146, 192, 201, 0.1)",
        bgStart: "#0a0a0c",
        bgMid: "#1a0b2e",
        bgEnd: "#0a0a0c",
        accentCyan: "#13c8ec",
        accentPurple: "#7c3aed",
        glassBorder: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
