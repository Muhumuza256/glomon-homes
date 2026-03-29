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
          DEFAULT: '#1A3A6B',
          light: '#2B5BA8',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA6A0A',
        },
        bg: '#F8FAFF',
        surface: '#FFFFFF',
        'text-main': '#1A1A2E',
        'text-muted': '#64748B',
        border: '#E2E8F0',
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
