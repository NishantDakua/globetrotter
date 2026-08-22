/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gt-bg': '#0f172a', // Dark navy background
        'gt-input': '#1e293b', // Dark slate input
        'gt-border': '#334155', // Subtle border
        'gt-primary': '#3b82f6', // Blue primary accent
        'gt-primary-hover': '#2563eb', // Hover state
        'gt-text-light': '#94a3b8', // Small supporting description
        'gt-card': 'rgba(30, 41, 59, 0.7)', // Glassmorphism card bg

        // Luxury Travel Theme Colors (My Trips)
        'gt-dark': '#0b0c10',
        'gt-surface': '#141622',
        'gt-surface-hover': '#1b1e2e',
        'gt-sidebar': '#111219',
        'gt-teal': '#009688',
        'gt-teal-light': '#14b8a6',
        'gt-teal-dark': '#00796b',
        'gt-border-subtle': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
