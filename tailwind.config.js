/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        koop:{ // main koop blue
          'def':'#7BC6F1', //default
          'l':'#B3DEF7', //light
          'd':'#1792D8' //dark
        }
      }
    },
  },
  plugins: [],
}

