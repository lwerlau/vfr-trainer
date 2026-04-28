/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#07111f',
          950: '#0a1628',
        },
        cockpit: {
          amber: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
}
