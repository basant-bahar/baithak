/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1e40af',
        'primary-dark': '#1e3a8a',
        'primary-light': '#38bdf8',
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
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        "accent": "#760010"
      }
    ]
  }
}
