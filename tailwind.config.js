/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#2563eb", 
        
        "background-light": "#f8fafc", 
        
        // Background Dark Mode
        "background-dark": "#0f172a", 
      },

      fontFamily: {
        display: ["Public Sans", "sans-serif"],
      },
    },
  },

  plugins: [],
};