/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#FF3F6C', // Myntra-like pink/red
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
}
