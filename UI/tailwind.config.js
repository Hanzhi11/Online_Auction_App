/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        'node_modules/flowbite-react/lib/esm/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    500: '#64bd5f',
                },
                indigo: {
                    900: '#3f395f',
                },
            },
            saturate: {
                75: '.75',
            },
            transitionProperty: {
                width: 'width',
            },
            zIndex: {
                9999: '9999',
            },
            fontSize: {
                xxs: '0.65rem',
            },
        },
        fontFamily: {
            sans: ['Poppins', 'Arial', 'sans-serif'],
        },
        transitionDuration: {
            2000: '2000ms'
        }
    },
    plugins: [formsPlugin],
    important: true,
};
