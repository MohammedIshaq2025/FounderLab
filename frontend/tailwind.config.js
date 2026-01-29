/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          850: '#231F1E',
          900: '#1C1917',
          950: '#171412',
        },
        terra: {
          50: '#FFF7F5',
          100: '#FDECE7',
          400: '#F0845A',
          500: '#E8613C',
          600: '#C4502D',
          700: '#A83A1F',
        },
        phase: {
          1: '#E8613C',
          '1-bg': '#FDECE7',
          '1-bg-dark': '#3D1D12',
          2: '#D97706',
          '2-bg': '#FEF3C7',
          '2-bg-dark': '#3D2A06',
          3: '#7C3AED',
          '3-bg': '#EDE9FE',
          '3-bg-dark': '#251539',
          4: '#BE123C',
          '4-bg': '#FFE4E6',
          '4-bg-dark': '#3D0A14',
          5: '#0D9488',
          '5-bg': '#CCFBF1',
          '5-bg-dark': '#0A2D29',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-from-right': {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-from-left': {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'card-enter': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.35s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.35s ease-out',
        'card-enter': 'card-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
