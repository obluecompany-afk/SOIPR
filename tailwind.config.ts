import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          dark: '#9E0C24',
          light: '#FFE5E9',
        },
        text: {
          DEFAULT: '#1A1A1A',
          muted: '#6B6B6B',
        },
        cream: '#F8F4EE',
        menu: '#F5F1E8',
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;
