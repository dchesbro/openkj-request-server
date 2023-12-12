/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vite/index.html",
    "./vite/src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  theme: {
    extend: {},
  },
}

