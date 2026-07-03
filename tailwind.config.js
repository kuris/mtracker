/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 30, 30, 0.7)',
          lighter: 'rgba(255, 255, 255, 0.5)',
          darker: 'rgba(30, 30, 30, 0.5)',
        },
      },
      backdropBlur: {
        glass: '10px',
      },
      backgroundColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surface: 'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
      },
      borderColor: {
        glass: 'var(--color-border-glass)',
      },
    },
  },
  plugins: [],
}
