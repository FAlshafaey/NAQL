import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        bg: "#FBF9F5",
        surface: "#FFFFFF",
        "surface-muted": "#F3F1EA",
        border: {
          DEFAULT: "#E4E0D5",
          strong: "#D3CDBE",
        },
        ink: {
          DEFAULT: "#1E2420",
          muted: "#5C635D",
          faint: "#8A9089",
        },
        primary: {
          DEFAULT: "#0B4332",
          dark: "#083527",
          light: "#E8F0EC",
        },
        teal: {
          DEFAULT: "#3F6E67",
          light: "#E9F1EF",
        },
        gold: {
          DEFAULT: "#B8862E",
          light: "#FBF1DF",
        },
        success: {
          DEFAULT: "#3F8F5F",
          light: "#E7F3EC",
        },
        warning: {
          DEFAULT: "#B8862E",
          light: "#FBF1DF",
        },
        danger: {
          DEFAULT: "#B0503F",
          light: "#FBEAE6",
        },
        info: {
          DEFAULT: "#3D6B8C",
          light: "#E8F1F6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Tahoma", "sans-serif"],
        body: ["var(--font-body)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(30, 36, 32, 0.04), 0 4px 16px rgba(30, 36, 32, 0.05)",
        card: "0 1px 3px rgba(30, 36, 32, 0.05), 0 1px 2px rgba(30, 36, 32, 0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
