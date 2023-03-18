/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#800011',
        'primary-dark': '#760010',
        'primary-light': '#aa0218',
        'secondary': '#ffc051',
        'secondary-dark': '#ffb32d',
      },
      flexGrow: {
        2: '2'
      }
    },
    container: {
      center: true,
    },
    minWidth: {
      '0': '0',
      '1/4': '25%',
      '1/3': '30%',
      '1/2': '50%',
      '70': '70%',
      '3/4': '75%',
      'full': '100%',
    },
    screens: {
      'xs': '475px',
      'max-xs': { 'max': '550px' },
      'max-sm': { 'max': '640px' },
      'max-md': { 'max': '768px' },
      'max-lg': { 'max': '840px' },
      ...defaultTheme.screens,
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    require('daisyui'),
    require('tw-elements/dist/plugin'),
  ],
  daisyui: {
    themes: [
      {
        "accent": "#760010"
      }
    ]
  }
}
