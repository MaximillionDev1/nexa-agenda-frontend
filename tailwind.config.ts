import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        card: '#18181B',
        text: '#FAFAFA',
        'text-secondary': '#A1A1AA',
        primary: '#7C3AED',
        'primary-light': '#A78BFA',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
} satisfies Config