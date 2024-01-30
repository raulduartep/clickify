/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Karla', 'sans-serif'],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.625rem" }],
      },
      colors: {
        brand: {
          DEFAULT: "#4C75F2",
          600: "#3c5af2",
        },
        grey: {
          100: "#d5d6d7",
          500: "#8e8f90",
          600: '#3c414a',
          800: "#30353c",
          900: "#1e2127"
        },

      }
    },
  },
  plugins: [],
}

