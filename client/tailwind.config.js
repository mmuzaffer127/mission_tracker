/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#07090E',
        surface: {
          50: '#151921',
          100: '#11151D',
          200: '#0D1117',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)'
        },
        brand: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.6)'
      }
    }
  },
  plugins: []
};
