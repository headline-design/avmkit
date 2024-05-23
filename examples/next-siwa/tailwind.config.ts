const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./siwa-app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./siwa-app/**/**/*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        default: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // Modal
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.3s ease-out forwards",
        // Input Select
        "input-select-slide-up":
          "input-select-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "input-select-slide-down":
          "input-select-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        // Accordion
        "accordion-down": "accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Custom wiggle animation
        wiggle: "wiggle 0.75s infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-radix")(),
    require("tailwindcss-animate"),
  ],
};
