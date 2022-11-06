/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
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
      'xs': '550px',
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
  ],
  daisyui: {
    themes: [
      {
        "accent": "#760010"
      }
    ]
  }
}
