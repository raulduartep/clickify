/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.5rem"
      },
      colors: {
        brand: {
          DEFAULT: "#4C75F2"
        },
        grey: {
          100: "#d5d6d7",
          600: '#3c414a',
          800: "#30353c",
          900: "#1e2127"
        },

      }
    },
  },
  plugins: [],
}

