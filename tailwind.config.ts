import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.ts'],
  theme: { extend: { fontFamily: { sans: ['Cairo', 'Outfit', 'system-ui', 'sans-serif'], display: ['Outfit', 'Cairo', 'sans-serif'] } } },
  plugins: [],
};
export default config;
