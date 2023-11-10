/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            'white': '#FFF',
            'light-gray': '#ececec',
            'gray': '#e8e6e3',
            'dark-gray': '#181a1b',
            'red': '#b72451',
            'light-red': '#fa709b',
            'dark-blue': '#006989',
            'dark-red': '#700022',
            'purple': '#9604ad',
            'light-purple': '#ea77fc',
            'dark-purple': '#370040',
        }
    },
  },
  plugins: [],
}

