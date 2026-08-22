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
        'gt-surface-hover': '#1b1e2e',
        'gt-sidebar': '#111219',
        'gt-input': '#10131a',
        'gt-border': '#1F2937',
        'gt-border-hover': 'rgba(255, 255, 255, 0.16)',
        'gt-border-subtle': 'rgba(255, 255, 255, 0.08)',
        'gt-teal': '#00A88F',
        'gt-teal-hover': '#008F7A',
        'gt-teal-light': '#14b8a6',
        'gt-teal-dark': '#00796b',
        'gt-tab-active': '#1c2230',
        'gt-muted': '#8b92a4',
        'gt-text-muted': '#9CA3AF',
        'gt-text-light': '#94a3b8',
        'gt-bg': '#090B0E',
        'gt-card': '#11161D',
        'gt-card-hover': '#161C26',
        'gt-primary': '#3b82f6',
        'gt-primary-hover': '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['"Playfair Display"', 'Newsreader', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
