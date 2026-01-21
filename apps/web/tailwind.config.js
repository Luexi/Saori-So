/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#295570',
                'background-light': '#f9fafb',
                'background-dark': '#22262a',
                'surface-light': '#ffffff',
                'surface-dark': '#2d3339',
                'text-primary-light': '#131516',
                'text-secondary-light': '#6b7880',
                'text-primary-dark': '#f3f4f6',
                'text-secondary-dark': '#9ca3af'
            },
            fontFamily: {
                display: ['Manrope', 'sans-serif']
            },
            boxShadow: {
                floating: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                soft: '0 2px 8px rgba(0,0,0,0.04)'
            }
        }
    },
    plugins: []
};
