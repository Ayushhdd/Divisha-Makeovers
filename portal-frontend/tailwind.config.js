/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rosegold: {
          50: '#fdf8f9',
          100: '#fceef1',
          200: '#f9d9e0',
          300: '#f0b8c4',
          400: '#e08fa0',
          500: '#b76e79',
          600: '#a05a65',
          700: '#864a54',
          800: '#6f3f47',
          900: '#5c373d',
        },
        softpink: {
          50: '#fff5f7',
          100: '#ffe8ee',
          200: '#ffd1dc',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
