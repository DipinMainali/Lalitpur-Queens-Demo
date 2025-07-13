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

        "brand-primary": "#10316B", // Dark Blue / Navy
        "brand-secondary": "#0B8457", // Dark Green (Success)
        accent: "#EAC100", // Gold / Amber (CTA/Warning)
        background: "#DEE1EC", // Light Grayish Blue
        "text-primary": "#212121", // Dark Gray
        "text-secondary": "#666666", // Medium Gray
        white: "#FFFFFF",
        error: "#D32F2F", // Red
        info: "#2196F3",
      },
    },
  },
  plugins: [],
};
