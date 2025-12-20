/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: '#0a0e27',
          darker: '#050816',
          purple: '#6366f1',
          cyan: '#06b6d4',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
        neon: {
          blue: '#00f0ff',
          purple: '#bd00ff',
          pink: '#ff006e',
          green: '#00ff94',
        }
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'cyber-gradient': 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        'neon-gradient': 'linear-gradient(45deg, #00f0ff, #bd00ff, #ff006e)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6' },
          '100%': { boxShadow: '0 0 20px #3b82f6, 0 0 30px #3b82f6, 0 0 40px #3b82f6' },
        }
      }
    },
  },
  plugins: [],
}
