/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'hsl(210 20% 95%)',
        'accent': 'hsl(160 60% 50%)',
        'primary': 'hsl(210 40% 40%)',
        'surface': 'hsl(210 20% 100%)',
        'text-primary': 'hsl(210 20% 20%)',
        'text-secondary': 'hsl(210 20% 40%)',
        'dark': {
          'bg': 'hsl(240 10% 8%)',
          'surface': 'hsl(240 10% 12%)',
          'card': 'hsl(240 10% 16%)',
          'text-primary': 'hsl(0 0% 95%)',
          'text-secondary': 'hsl(0 0% 70%)',
          'border': 'hsl(240 10% 20%)',
          'accent': 'hsl(160 60% 50%)',
          'purple': 'hsl(270 70% 60%)',
          'purple-light': 'hsl(270 70% 80%)',
        }
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'xl': '24px',
        'lg': '16px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': 'rgba(0, 0, 0, 0.05) 0px 4px 12px',
        'dark-card': 'rgba(0, 0, 0, 0.3) 0px 4px 12px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}