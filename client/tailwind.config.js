/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1129e2',
        surface: {
          50: 'rgba(255,255,255,0.15)',
          100: 'rgba(255,255,255,0.10)',
          200: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.20)',
          hover: 'rgba(255,255,255,0.08)'
        },
        brand: {
          blue: '#1129e2',
          cyan: '#a5f3fc',
          emerald: '#86efac',
          purple: '#c4b5fd',
          amber: '#fde68a',
          rose: '#fda4af',
          electric: '#3b55ff',
          white: '#ffffff'
        },
        ink: {
          DEFAULT: '#ffffff',
          70: 'rgba(255,255,255,0.7)',
          50: 'rgba(255,255,255,0.5)',
          30: 'rgba(255,255,255,0.3)',
          10: 'rgba(255,255,255,0.1)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      letterSpacing: {
        tighter: '-0.08em',
        tight: '-0.06em',
        snug: '-0.04em',
      },
      boxShadow: {
        glass: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
        glow: '0 0 40px -10px rgba(255,255,255,0.4)',
        'glow-sm': '0 0 20px -5px rgba(255,255,255,0.2)',
        card: '0 8px 32px rgba(0,0,0,0.3)',
        float: '0 24px 64px rgba(0,0,0,0.25)',
      }
    }
  },
  plugins: []
};

