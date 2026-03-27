/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D14',
        surface: '#16161F',
        card: '#1E1E2E',
        border: '#2A2A3D',
        primary: '#7C6FFF',
        'primary-dark': '#5B50CC',
        accent: '#FF6B9D',
        success: '#4ADE80',
        warning: '#FBBF24',
        error: '#F87171',
        'text-primary': '#F0F0FF',
        'text-secondary': '#8B8BA7',
        'text-muted': '#4A4A65',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
