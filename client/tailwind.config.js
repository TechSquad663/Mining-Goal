/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coal: {
          950: '#080A0E',
          900: '#0D1117',
          850: '#12171F',
          800: '#161D27',
          750: '#1C2431',
          700: '#232D3E',
          600: '#323E53',
          500: '#4A576E',
          400: '#7E8B9F',
          300: '#A9B4C4',
          200: '#D1D7E0',
          100: '#EAEFF5',
          50: '#F4F7FA',
        },
        gold: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          400: '#FBBF24',
          300: '#FCD34D',
        },
        status: {
          verified: '#10B981',
          conflict: '#EF4444',
          pending: '#F59E0B',
          processing: '#3B82F6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
