/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // These use CSS variables so they swap automatically with dark class
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "surface-tint": "var(--color-surface-tint)",
        "surface-container": "var(--color-surface-container)",
        "on-error-container": "var(--color-on-error-container)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "tertiary": "var(--color-tertiary)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "secondary-container": "var(--color-secondary-container)",
        "background": "var(--color-background)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "inverse-surface": "var(--color-inverse-surface)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "primary-fixed": "var(--color-primary-fixed)",
        "on-background": "var(--color-on-background)",
        "tertiary-container": "var(--color-tertiary-container)",
        "surface": "var(--color-surface)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "inverse-primary": "var(--color-inverse-primary)",
        "primary": "var(--color-primary)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "on-error": "var(--color-on-error)",
        "on-secondary": "var(--color-on-secondary)",
        "on-primary-container": "var(--color-on-primary-container)",
        "on-tertiary": "var(--color-on-tertiary)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "error": "var(--color-error)",
        "primary-container": "var(--color-primary-container)",
        "on-surface": "var(--color-on-surface)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "error-container": "var(--color-error-container)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "secondary": "var(--color-secondary)",
        "surface-dim": "var(--color-surface-dim)",
        "on-primary": "var(--color-on-primary)",
        "surface-variant": "var(--color-surface-variant)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-bright": "var(--color-surface-bright)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
