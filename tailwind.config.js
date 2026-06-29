/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0A0A0A',
        surface: '#141414',
        card:    '#1B1B1B',
        text1:   '#F5F5F3',
        text2:   '#A1A1AA',
        border:  '#2A2A2A',
        accent:  '#540A21',
        pink:    '#FF2D9B',
        'pink-dark': '#CC0077',
      },
      fontFamily: {
        pixel:   ['var(--font-pixel)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
