import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./apps/example/index.html",
    "./apps/example/src/**/*.{js,ts,jsx,tsx}",
    "./packages/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
