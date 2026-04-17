/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
        },
        main: "hsl(var(--bg-main) / <alpha-value>)",
        card: "hsl(var(--bg-card) / <alpha-value>)",
        muted: "hsl(var(--text-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
      },
      textColor: {
        DEFAULT: "hsl(var(--text-main) / <alpha-value>)",
        main: "hsl(var(--text-main) / <alpha-value>)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
