/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          100: "#FAF3E0",
          200: "#EADBC8",
        },
        brown: {
          700: "#6B4226",
          800: "#5A3E36",
          900: "#3E2C29",
        },
        green: {
          600: "#4A7C59",
          700: "#3F6B50",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
