const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./siwa-app/**/*.{js,ts,jsx,tsx,mdx}",
    "./siwa-dashboard/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: {
          DEFAULT: "var(--border)",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          accent: "var(--primary-background)",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          accent: "var(--primary-accent)",
        },
        tooltip: {
          DEFAULT: "var(--primary-foreground-2)",
          foreground: "var(--primary-accent)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        "lime": {
          DEFAULT: "hsl(var(--lime))",
          foreground: "hsl(var(--lime-foreground))",
          hover: "hsl(var(--tomato))",
        },
        "tomato": {
          DEFAULT: "hsl(var(--tomato))",
          foreground: "hsl(var(--tomato-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "accents-0": {
          DEFAULT: "var(--accents-0)",
        },
        "accents-1": {
          DEFAULT: "var(--accents-1)",
        },
        "accents-2": {
          DEFAULT: "var(--accents-2)",
        },
        "accents-3": {
          DEFAULT: "var(--accents-3)",
        },
        "accents-4": {
          DEFAULT: "var(--accents-4)",
        },
        "accents-5": {
          DEFAULT: "var(--accents-5)",
        },
        "accents-6": {
          DEFAULT: "var(--accents-6)",
        },
        "accents-7": {
          DEFAULT: "var(--accents-7)",
        },
        "accents-8": {
          DEFAULT: "var(--accents-8)",
        },
        "ds-100": {
          DEFAULT: "var(--ds-background-100)",
        },

      },
      textColor: {
        DEFAULT: "var(--text)",
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          accent: "var(--accents-5)",
        },
        tertiary: {
          DEFAULT: "var(--text-tertiary)",
        },
        active: "var(--text-active)",
        link: "var(--text-link)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: `var(--radius-lg)`,
        md: `calc(var(--radius-lg) - 2px)`,
        sm: "calc(var(--radius-lg) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        // mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
