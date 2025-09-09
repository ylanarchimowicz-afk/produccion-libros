/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx,ts,tsx}",       // archivos en la raíz
    "./src/**/*.{js,jsx,ts,tsx}" // todo src
  ],
  theme: { extend: {} },
  plugins: [],
};
