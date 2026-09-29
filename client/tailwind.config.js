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
          50: '#FAF6ED',
          100: '#F5EED9',
          200: '#ECDDB3',
          300: '#E2C889',
          400: '#D8B45E',
          500: '#C5A049',
          600: '#A68236',
          700: '#826227',
          800: '#5E441B',
          900: '#3E2C0F',
        },
        blush: {
          50: '#FDF8F9',
          100: '#FBF0F3',
          200: '#F6E0E6',
          300: '#EEC4CF',
          400: '#E29FB0',
          500: '#D57991',
          600: '#BE5671',
          700: '#9F3E56',
          800: '#7E3245',
          900: '#5A2331',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FBE4E8',
          200: '#F7CCD5',
          300: '#EEA4B4',
          400: '#E1718B',
          500: '#CC4163',
          600: '#B02A4C',
          700: '#8B1E3B',
          800: '#6B172E',
          900: '#4A0E1F',
        },
        ivory: {
          50: '#FCFBF8',
          100: '#FAF7F2',
          200: '#F4EDE2',
          300: '#ECE1CE',
          400: '#DFCEB5',
          500: '#CBB696',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 23, 46, 0.06)',
        'luxury': '0 10px 30px -5px rgba(107, 23, 46, 0.1), 0 4px 6px -2px rgba(197, 160, 73, 0.05)',
        'glow': '0 0 20px rgba(216, 180, 94, 0.35)',
      }
    },
  },
  plugins: [],
}
