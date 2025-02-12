/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "infinite-scroll": "infinite-scroll 70s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      colors: {
        beige: {
          100: "#FAF3E0",
          200: "#EADBC8",
        },
        brown: {
          300: "#D8BFAA",
          700: "#6B4226",
          800: "#5A3E36",
          900: "#3E2C29",
        },
        green: {
          600: "#81b29a",
          700: "#3F6B50",
        },
        pink: {
          500: "#F49CBB",
        },
        blue: {
          500: "#CBEEF3",
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
