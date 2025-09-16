/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Definindo as cores da ALTM
        'altm-gold-50': '#fdfaf2',
        'altm-gold-100': '#fcf5e6',
        'altm-gold-200': '#faedcd',
        'altm-gold-300': '#f7e0a4',
        'altm-gold-400': '#f4d37a',
        'altm-gold-500': '#f1c651',
        'altm-gold-600': '#c1a44e', // Cor principal
        'altm-gold-700': '#a68d3f', // Cor secundária
        'altm-gold-800': '#8b6f2a',
        'altm-gold-900': '#70561e',
      }
    },
  },
  plugins: [],
}
