/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#8b1a1a',
        'vibrant-red': '#c41e3a',
        'dark-red': '#6b1414',
      },
    },
  },
  plugins: [],
}
