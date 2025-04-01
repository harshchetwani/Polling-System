// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Make sure this includes all JS/JSX/TS/TSX files in the 'src' directory
    "./public/index.html", // Include the index.html file in public folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
