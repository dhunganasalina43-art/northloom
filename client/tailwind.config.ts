import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Northloom identity: indigo dye + undyed linen + a rust weft-thread accent.
        linen: {
          50: "#faf7f0",
          100: "#f2ecdd",
          200: "#e6dcc2",
        },
        ink: {
          900: "#1c2331",
          700: "#2c3446",
        },
        indigo: {
          500: "#3c5a86",
          600: "#324a6d",
          700: "#28394f",
        },
        weft: {
          500: "#a1503f",
          600: "#8a4234",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-display)", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};

export default config;
