/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
      },
      boxShadow: {
        soft: '0 18px 40px rgba(15, 23, 42, 0.10)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(37,99,235,0.22), transparent 42%), radial-gradient(circle at bottom right, rgba(15,118,110,0.18), transparent 35%), linear-gradient(135deg, #f8fafc 0%, #eef4ff 45%, #f8fafc 100%)',
      },
    },
  },
  plugins: [],
};
