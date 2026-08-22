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
        'gt-border': 'rgba(255, 255, 255, 0.08)',
        'gt-border-hover': 'rgba(255, 255, 255, 0.16)',
        'gt-teal': '#00a884',
        'gt-teal-hover': '#009272',
        'gt-tab-active': '#1c2230',
        'gt-muted': '#8b92a4',
        'gt-bg': '#090B0E',
        'gt-card': '#11161D',
        'gt-card-hover': '#161C26',
        'gt-border': '#1F2937',
        'gt-teal': '#00A88F',
        'gt-teal-hover': '#008F7A',
        'gt-text-muted': '#9CA3AF',
        'gt-input': '#131920',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
// Trigger rebuild
