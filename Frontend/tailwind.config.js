/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add this line to define 'bg-background'
        background: "hsl(var(--background))", 
        // OR simply use a direct color if not using variables:
        // background: "#ffffff",
      },
    },
  },
  plugins: [],
}
