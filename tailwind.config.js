/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#C8FF00',
        dark: '#0a0a0a',
        dark2: '#111111',
        card: '#1a1a1a',
        muted: '#888888',
        blue: '#1A1AFF',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        tickerScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        tickerScrollReverse: {
          '0%': { transform: 'translateX(-33.333%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
        bounceDown: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(10px)' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 4px rgba(200,255,0,0.2)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,255,0,0.05)' },
        },
      },
      animation: {
        'ticker': 'tickerScroll 25s linear infinite',
        'ticker-reverse': 'tickerScrollReverse 25s linear infinite',
        'pulse-dot': 'pulseDot 2s infinite',
        'bounce-down': 'bounceDown 2s infinite',
        'dot-bounce': 'dotBounce 1.4s infinite ease-in-out',
        'pulse-ring': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
