import daisyui from "daisyui";

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}"
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'scale-up': 'scaleUp 0.5s ease-out',
        'card-hover': 'cardHover 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        cardHover: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
          '100%': { transform: 'scale(1.05)', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' },
        },
      },
    },
  },
  plugins: [
    daisyui,
  ],
};
