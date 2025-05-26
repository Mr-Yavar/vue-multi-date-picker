/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        vazirMatn: ['"Vazirmatn"', 'Vazirmatn UI'],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /grid-cols-*/,
    },
  ],
}
