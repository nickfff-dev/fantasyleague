/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#FF9429',
        'gray-dark': '#121820',
        'gray-medium': '#181F26',
        'gray-light': '#222930',
      },
      fontFamily: {
        dubai: ['dubai', 'sans-serif'],
        xix: ['xix', 'sans-serif'],
      },
    },
    screens: {
      'laptop-L': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      laptop: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      tablet: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      mobile: { max: '767px' },
      // => @media (max-width: 767px) { ... }
    },
  },
  plugins: [],
};
