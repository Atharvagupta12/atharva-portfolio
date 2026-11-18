import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        lime: "rgb(var(--lime) / <alpha-value>)",
        cyan: "rgb(var(--cyan) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderColor: { DEFAULT: "rgb(255 255 255 / 0.08)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-rev": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        ping2: { "0%": { transform: "scale(1)", opacity: "0.7" }, "100%": { transform: "scale(2.6)", opacity: "0" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-rev": "marquee-rev 45s linear infinite",
        ping2: "ping2 1.8s cubic-bezier(0,0,.2,1) infinite",
        blink: "blink 1s step-end infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
