/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F6',
          100: '#FBEFED',
          200: '#F7DFDB',
          300: '#EFC4BD',
          400: '#E4A297',
          500: '#D57B6C',
          600: '#C25D4D',
          700: '#A34638',
          800: '#863B30',
          900: '#6F342B',
          950: '#3D1812',
        },
        roseGold: {
          light: '#F8E8E6',
          DEFAULT: '#E8B4B8',
          dark: '#B87D84'
        },
        champagne: {
          light: '#FBF8F2',
          DEFAULT: '#EADBC8',
          dark: '#BCA893'
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E7E7E9',
          200: '#D1D1D6',
          500: '#71717A',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#0F0F12',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -4px rgba(213, 123, 108, 0.08)',
        'glow': '0 0 25px rgba(213, 123, 108, 0.25)',
      }
    },
  },
  plugins: [],
}
