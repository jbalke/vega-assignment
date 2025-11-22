/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        accentMuted: 'var(--color-accent-muted)',
        success: '#16a34a',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 24px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
}
