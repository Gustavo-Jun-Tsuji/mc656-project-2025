/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Azul Tailwind padrão
          light: '#93c5fd',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#10b981', // Verde Tailwind padrão
          light: '#6ee7b7',
          dark: '#047857',
        },
        danger: {
          DEFAULT: '#ef4444', // Vermelho Tailwind padrão
          light: '#fca5a5',
          dark: '#b91c1c',
        }
      }
    }
  },
  plugins: [],
}