/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', './dist/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        black: 'var(--black-color)',
        white: 'var(--white-color)',
      },
    },
  },
  plugins: [],
}
