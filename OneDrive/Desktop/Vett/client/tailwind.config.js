/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a90e2',
        'primary-dark': '#357abd',
        secondary: '#50c878',
        accent: '#ff6b6b',
      },
    },
  },
  plugins: [],
}
