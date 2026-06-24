/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        buildmode: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        anchor: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        empress: {
          50: '#faf5eb',
          100: '#f0e4c9',
          200: '#e0c999',
          300: '#d0ae69',
          400: '#c09339',
          500: '#b8860b',
          600: '#936e09',
          700: '#6e5107',
          800: '#4a3504',
          900: '#251a02',
          950: '#120d01',
        },
        cream: {
          50: '#fefcf5',
          100: '#fdf8eb',
          200: '#faf0d3',
          300: '#f5e4b3',
          400: '#e8ce7d',
          500: '#d4b04a',
          600: '#b89130',
          700: '#9a7629',
          800: '#7e6029',
          900: '#684f27',
          950: '#3a2a12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
      },
    }
  },
  plugins: []
};