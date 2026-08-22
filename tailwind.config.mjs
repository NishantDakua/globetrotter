/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
}
