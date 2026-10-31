import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ink: '#0C1626', lapis: '#16263D', mist: '#C8D4E6', paper: '#F2F6FB',
        amber: '#FFB23E', mint: '#4FE3B5', rose: '#E2456F',
      },
      fontFamily: {
        display: ['var(--f-kufi-ar)', 'var(--f-kufi-la)', 'var(--f-plex-ar)', 'sans-serif'],
        sans: ['var(--f-plex-ar)', 'var(--f-plex-la)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
