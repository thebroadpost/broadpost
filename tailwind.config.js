/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        background: "#FFFFFF",
        accent: {
          red: "#CC0000",
          blue: "#003580",
        },
        gray: {
          100: "#F5F5F5",
          200: "#E8E8E8",
          400: "#9A9A9A",
          700: "#333333",
        },
        border: "#E2E2E2",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      }
    },
  },
  plugins: [],
}
