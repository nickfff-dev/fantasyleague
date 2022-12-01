/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,css}', './components/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      backgroundImage: theme => ({
        loginb: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4dc43ecf-c693-4dd5-9897-81678f0f7fce/d99797k-c95dd2ee-d674-40de-93bf-2bcdc562500e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRkYzQzZWNmLWM2OTMtNGRkNS05ODk3LTgxNjc4ZjBmN2ZjZVwvZDk5Nzk3ay1jOTVkZDJlZS1kNjc0LTQwZGUtOTNiZi0yYmNkYzU2MjUwMGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.-qmJaAbj9tixe1VC9dPDTOjx5FG-JkxRXJmIfdi4-CI')",
      }),
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
