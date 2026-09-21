/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          midnight: '#17122B',
          deep: '#221839',
        },
        maroon: {
          heritage: '#681A2D',
          soft: '#7E2538',
        },
        terracotta: {
          DEFAULT: '#C84E37',
          soft: '#D9684C',
        },
        saffron: {
          DEFAULT: '#E9A52B',
          soft: '#F0BC4D',
        },
        turmeric: {
          DEFAULT: '#D8A72C',
          soft: '#E6BE4A',
        },
        forest: {
          DEFAULT: '#174B3A',
        },
        ivory: {
          DEFAULT: '#FFF8EA',
          muted: '#F5EDD9',
        },
        sand: {
          DEFAULT: '#E8D7B9',
          muted: '#D4C09A',
        },
      },
      fontFamily: {
        devanagari: ['"Tiro Devanagari Hindi"', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee-slow': 'marquee 40s linear infinite',
        'grain-shift': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-5%)' },
          '30%': { transform: 'translate(3%,-2%)' },
          '50%': { transform: 'translate(-2%,3%)' },
          '70%': { transform: 'translate(4%,1%)' },
          '90%': { transform: 'translate(-3%,2%)' },
        },
      },
    },
  },
  plugins: [],
};
