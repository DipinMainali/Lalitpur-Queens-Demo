/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* CSS HEX */
        "queens-black": "#000000",
        "queens-emerald": "#76C288",
        "queens-white": "#FFFFFF",
        "queens-blue": "#0A75BA",
        "queens-green": "#009622",
        "queens-midnight": "#055765",
      },
    },
  },
  plugins: [],
};
