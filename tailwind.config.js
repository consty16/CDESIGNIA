/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: 'oklch(62.7% .265 303.9)',
        },
        bg: '#1a1626',
      },
      backgroundColor: {
        'deep': '#1a1626',
      }
    },
  },
  plugins: [],
}
