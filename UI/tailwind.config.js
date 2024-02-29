/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],  
  theme: {
    extend: {
      colors: {
        green: {
          500: '#64bd5f'
        },
        indigo: {
          900: '#3f395f'
        },
      },
      saturate: {
        75: '.75'
      },
      transitionProperty: {
        'width': 'width',
      },
      zIndex: {
        '9999': '9999',
      },
      fontSize: {
        xxs: '0.65rem'
      }
    },
    fontFamily: {
      sans: ['Poppins', 'Arial', 'sans-serif']
    },
  },
  plugins: [],
  important: true,
}

