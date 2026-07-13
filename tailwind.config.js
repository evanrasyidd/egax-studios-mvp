/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#FAF7F0', // Paper — base bg terang, ganti dari dark editorial
        surface: '#FFFFFF',
        card:    '#FFFFFF',
        text1:   '#14120F', // Ink — teks utama & outline kartun
        text2:   '#514E48', // Ink muted
        border:  '#14120F', // Ink juga — border tebal cartoon butuh kontras penuh, bukan abu tipis
        accent:  '#2E4BFF', // Riot Blue — pop primer
        pink:    '#FF2E7E', // Pop Pink — versi cerah dari brand pink lama
        'pink-dark': '#CC1B5E',
        yellow:  '#FFD400', // Sunburst — pop kedua, buat CTA/badge
      },
      fontFamily: {
        pixel:   ['var(--font-display)', 'sans-serif'], // dead alias, semua caller sudah dipindah ke font-display
        display: ['var(--font-display)', 'sans-serif'],
        comic:   ['var(--font-comic)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        ink:    '4px 4px 0 #14120F',
        'ink-sm': '2px 2px 0 #14120F',
        'ink-lg': '8px 8px 0 #14120F',
      },
    },
  },
  plugins: [],
}
