/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
        },
        accent: {
          DEFAULT: '#D4A017',
          hover: '#B8860B',
        },
        bg: '#F9F6F0',
        surface: '#FFFFFF',
        'text-main': '#1A1A1A',
        'text-muted': '#6B7280',
        border: '#E5E0D8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
