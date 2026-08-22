/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gt-dark': '#0c0e12',
        'gt-surface': '#12151c',
        'gt-input': '#10131a',
        'gt-border': '#1F2937',
        'gt-border-hover': 'rgba(255, 255, 255, 0.16)',
        'gt-teal': '#00A88F',
        'gt-teal-hover': '#008F7A',
        'gt-tab-active': '#1c2230',
        'gt-muted': '#8b92a4',
        'gt-text-muted': '#9CA3AF',
        'gt-bg': '#090B0E',
        'gt-card': '#11161D',
        'gt-card-hover': '#161C26',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
