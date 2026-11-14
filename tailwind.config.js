/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#FAFAF8', // Paper putih hangat — base archive
        surface: '#FFFFFF', // Putih bersih — panel/card
        card:    '#FFFFFF',
        text1:   '#111111', // Hitam pekat — teks utama
        text2:   '#5F5F5F', // Abu gelap — lolos WCAG AA di bg & surface
        border:  '#E5E4E0', // Rule tipis abu terang (dekoratif)
        accent:  '#111111', // Hitam — badge solid
        pink:    '#111111', // "Pop" monochrome = hitam
        'pink-dark': '#000000',
        yellow:  '#ECEBE6', // Highlight abu hampir tak terlihat
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        ink:    'none',
        'ink-sm': 'none',
        'ink-lg': 'none',
        panel:  'none',
      },
    },
  },
  plugins: [],
}
