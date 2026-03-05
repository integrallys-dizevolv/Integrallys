import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        // Cores da Marca Integrallys - Baseadas na Logo
        integrallys: {
          blue: {
            DEFAULT: '#0039A6',
            hover: '#002d82',
            light: '#0052cc',
            dark: '#002566',
            50: '#e6f0ff',
            100: '#cce0ff',
            200: '#99c2ff',
            300: '#66a3ff',
            400: '#3385ff',
            500: '#0039A6',
            600: '#0033a1',
            700: '#002d82',
            800: '#002666',
            900: '#001a47',
          },
          green: {
            DEFAULT: '#00B050',
            hover: '#009a44',
            light: '#00cc5c',
            dark: '#008a3d',
            50: '#e6f9ed',
            100: '#c3f0d3',
            200: '#99e2ad',
            300: '#66d182',
            400: '#33c159',
            500: '#00B050',
            600: '#00a34a',
            700: '#009144',
            800: '#007e3a',
            900: '#006230',
          }
        },
        // Padrão de Cores do Sistema - Baseado na Tela Repasse
        app: {
          // Backgrounds
          bg: {
            DEFAULT: '#ffffff',
            dark: '#020817',
            secondary: '#f9fafb',
            tertiary: '#f3f4f6',
          },
          // Cards
          card: {
            DEFAULT: '#ffffff',
            dark: '#0c1e3d',
          },
          // Textos
          text: {
            primary: '#101828',
            secondary: '#6a7282',
            muted: '#9ba3af',
          },
          // Bordas
          border: {
            light: 'rgba(229, 231, 235, 0.6)',
            DEFAULT: '#e5e7eb',
            dark: 'rgba(255, 255, 255, 0.05)',
            darkStrong: 'rgba(255, 255, 255, 0.1)',
          },
          // Tabela
          table: {
            header: {
              DEFAULT: 'rgba(249, 250, 251, 0.5)',
              dark: 'rgba(255, 255, 255, 0.05)',
            },
            hover: {
              DEFAULT: 'rgba(249, 250, 251, 0.5)',
              dark: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#0039A6",
        primaryForeground: "hsl(var(--primary-foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
}