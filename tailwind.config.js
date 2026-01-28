/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#BCDA72',
        black: '#000000',
        white: '#ffffff',
        red: '#9a0000'
      },
    },
  },
  plugins: [],
}


