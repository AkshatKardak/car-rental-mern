/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10A310',
        'primary-hover': '#13C113',
        background: '#FFFFFF',
        'background-secondary': '#F8F9FA',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'border-light': '#E5E7EB',
      },
    },
  },
  plugins: [],
}
