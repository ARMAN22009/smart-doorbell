/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        housing: "#1C2230",
        housingDeep: "#141923",
        panel: "#F6F3EC",
        panelLine: "#E4DECF",
        brass: "#C97B3D",
        brassLight: "#E0A468",
        sage: "#7C9885",
        clay: "#A8553F",
        ink: "#2A2A28",
        inkFaint: "#8A857A",
      },
      fontFamily: {
        mono: ["DM Mono", "ui-monospace", "monospace"],
        sans: ["Work Sans", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}

