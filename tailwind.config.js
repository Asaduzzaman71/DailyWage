// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',  // sm: classes apply ≥640px
      'md': '768px',  // md: classes apply ≥768px
    },
  },
  plugins: [],
}
