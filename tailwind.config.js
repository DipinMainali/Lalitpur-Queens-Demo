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
        "queens-emerald": "#23af1c",
        "queens-white": "#FFFFFF",
        "queens-blue": "#0574e7",
        "queens-green": "#e6bb1a",
        "queens-midnight": "#055765",
      },
    },
  },
  plugins: [],
};
