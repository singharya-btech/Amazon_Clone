/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          blue: '#232F3E',
          light: '#37475A',
          dark: '#F3A847',
          yellow: '#FEBD69',
          orange: '#F08804',
          gold: '#FF9900',
          background: '#EAEDED',
          button_hover: '#F3A847',
        }
      }
    },
  },
  plugins: [],
}