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
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
