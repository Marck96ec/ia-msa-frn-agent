/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ff',
          100: '#fce7ff',
          200: '#fad4ff',
          300: '#f7b3ff',
          400: '#f280ff',
          500: '#e84eff',
          600: '#d01eee',
          700: '#b00dd1',
          800: '#9010ab',
          900: '#760f8a',
        },
        baby: {
          blue: '#a8d8ea',
          pink: '#ffaaa6',
          yellow: '#fff1a8',
          green: '#c8e7d2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
