/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.js',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en las imagenes de referencia
        brand: {
          50: '#f3fae3',
          100: '#e6f5c4',
          200: '#d3ec8a',
          300: '#b9df55',
          400: '#a4d434',
          500: '#9ACD2C', // verde lima principal
          600: '#7eb11f',
          700: '#5e8a18',
          800: '#476a14',
          900: '#385510',
        },
        earth: {
          50: '#fbf7f1',
          100: '#f1e7d3',
          200: '#e0cba0',
          400: '#a07a3d',
          600: '#6b4f23',
        },
        ink: {
          900: '#0f1a0c',
          700: '#2a3a26',
          500: '#5a6a55',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '4xl': '32px',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(15, 26, 12, 0.08)',
        card: '0 10px 30px rgba(15, 26, 12, 0.10)',
      },
    },
  },
  plugins: [],
};
