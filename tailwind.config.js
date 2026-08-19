/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff', 100: '#e0eeff', 200: '#bcd9ff', 300: '#7eb5ff',
          400: '#3a8aff', 500: '#0a6eff', 600: '#0052d9', 700: '#0040a8',
          800: '#0a3d8a', 900: '#13294B', 950: '#0a1931',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'scroll-x': 'scroll-x 40s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
