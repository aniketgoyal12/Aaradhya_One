/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde6e6',
          200: '#fbcbcc',
          300: '#f7a4a6',
          400: '#ee6b70',
          500: '#dc3b42',
          600: '#b9222a',
          700: '#981a21',
          800: '#8b1e22',
          900: '#6c1a1e',
          950: '#3f0a0d',
        },
        gold: {
          50: '#fdfbf2',
          100: '#fbf5e1',
          200: '#f7e8be',
          300: '#f1d691',
          400: '#e8be5b',
          500: '#d4af37',
          600: '#b88e28',
          700: '#926c20',
          800: '#785620',
          900: '#65471f',
          950: '#3b260e',
        },
        devotional: {
          950: '#0a0406',
          900: '#12070a',
          850: '#1a0b0f',
          800: '#240e16',
          750: '#2e121c',
          700: '#3b1723',
        }
      },
      fontFamily: {
        devotional: ['"Rozha One"', 'serif'],
        regal: ['"Marcellus"', '"Plus Jakarta Sans"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'maroon-glow': '0 0 25px -5px rgba(139, 30, 34, 0.35)',
      }
    },
  },
  plugins: [],
}

