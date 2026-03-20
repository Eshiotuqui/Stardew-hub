/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stardew: {
          green: '#4a7c59',
          'green-dark': '#3a6147',
          brown: '#8b6914',
          'brown-light': '#c4a35a',
          sky: '#87ceeb',
          'sky-dark': '#5ba3c9',
          earth: '#d2b48c',
          cream: '#fdf6e3',
          wood: '#6b4423',
          gold: '#ffd700',
        }
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
