import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {},
  },
  plugins: [animate],
} satisfies Config;

export default config;
