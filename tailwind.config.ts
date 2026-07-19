export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',

        // Text - WCAG AA compliant (contrast ratio >= 4.5:1)
        text: 'var(--color-text)', // Primary text
        'text-secondary': 'var(--color-text-secondary)', // Secondary text (lighter)

        // Primary action
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
      },
      minHeight: {
        touch: '44px', // Minimum touch target size
      },
      minWidth: {
        touch: '44px',
      },
      fontSize: {
        // Readable font sizes
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
      },
    },
  },
  plugins: [],
};