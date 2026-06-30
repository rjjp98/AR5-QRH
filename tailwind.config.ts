import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
          900: '#0f172a',
        },
        petroleum: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c5d8',
          300: '#8ca7c5',
          400: '#678ab1',
          500: '#416d9d',
          600: '#2d4a6f',
          700: '#1a2741',
          800: '#0f1929',
          900: '#050d17',
        },
      },
      backgroundColor: {
        'ops-dark': '#0f0f0f',
        'ops-surface': '#1a1a1a',
        'ops-surface-alt': '#242424',
      },
      textColor: {
        'ops-primary': '#e4e4e7',
        'ops-secondary': '#a1a1aa',
      },
      borderColor: {
        'ops-border': '#3f3f46',
      },
    },
  },
  plugins: [],
};

export default config;
