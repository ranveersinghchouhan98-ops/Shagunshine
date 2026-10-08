/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFDF5',
          100: '#FEF9E1',
          200: '#FCF0BA',
          300: '#F9E489',
          400: '#F0D060',
          500: '#DFB738',
          600: '#C49B24',
          700: '#A17A16',
          800: '#7D5B0F',
          900: '#573D07',
        },
        blush: {
          50: '#FFF8FA',
          100: '#FFEEF3',
          200: '#FDDFE8',
          300: '#FBC5D5',
          400: '#F7A1BD',
          500: '#F0749E',
          600: '#E04E80',
          700: '#C52E63',
          800: '#9E1D4A',
          900: '#751034',
        },
        maroon: {
          50: '#FFF0F5',
          100: '#FCE4EC',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#F06292',
          500: '#EC407A',
          600: '#E91E63',
          700: '#D81B60',
          800: '#C2185B',
          900: '#880E4F',
          950: '#4A072A',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FFF9FB',
          200: '#FFF2F6',
          300: '#FDE6EF',
          400: '#FAD3E1',
          500: '#EAB6C8',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(233, 30, 99, 0.08)',
        'luxury': '0 10px 30px -5px rgba(233, 30, 99, 0.12), 0 4px 6px -2px rgba(223, 183, 56, 0.08)',
        'glow': '0 0 25px rgba(240, 208, 96, 0.45)',
        'glow-pink': '0 0 25px rgba(233, 30, 99, 0.35)',
      }
    },
  },
  plugins: [],
}
