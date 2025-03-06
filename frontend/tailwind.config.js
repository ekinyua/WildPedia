/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
    ],
    theme: {
        extend: {
            // Add scroll snap utilities
            scrollSnapType: {
                'y': 'y',
                'mandatory': 'mandatory',
            },
            // Add custom animations
            animation: {
                'fade-in': 'fade-in 1s ease-in-out',
                'fade-in-up': 'fade-in-up 1s ease-in-out',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [
        // Add scrollbar-hide plugin
        function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none', /* IE and Edge */
                    'scrollbar-width': 'none', /* Firefox */
                    '&::-webkit-scrollbar': {
                        display: 'none', /* Chrome, Safari, Opera */
                    },
                },
            });
        },
    ],
};