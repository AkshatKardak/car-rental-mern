/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-hover': '#2563EB',
        'background-secondary': '#F9FAFB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'border-light': '#E5E7EB',
      },
    },
  },
  plugins: [],
}
