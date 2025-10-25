/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'tron-cyan': '#00fff9',
        'tron-blue': '#0099ff',
        'tron-dark': '#000000',
        'tron-darker': '#000000',
      },
      boxShadow: {
        'tron-glow': '0 0 10px #00fff9, 0 0 20px #00fff9, 0 0 30px #00fff9',
        'tron-glow-sm': '0 0 5px #00fff9, 0 0 10px #00fff9',
      },
    },
  },
  plugins: [],
}
