/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0e1117',
          secondary: '#141824',
          card: '#1a1f2e',
          hover: '#1f2638',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          orange: '#f97316',
        },
        border: '#2a3142',
        text: {
          primary: '#e2e8f0',
          muted: '#8892a4',
          dim: '#4a5568',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
