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
          500: "#1BBE9D",
          600: "#16A085",
          700: "#3F6B50",
        },
        red: {
          500: "#E26156",
          600: "#C5554B",
        },
        yellow: {
          500: "#F7CC3E",
          600: "#DAB437",
        },
        blue: {
          500: "#5197C6",
          600: "#4581A9",
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
