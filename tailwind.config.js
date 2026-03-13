/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark Mode: Digital Vault ──
        obsidian: {
          50: '#e6e6e6',
          100: '#cccccc',
          200: '#999999',
          300: '#666666',
          400: '#333333',
          500: '#1a1a1a',
          600: '#141414',
          700: '#0f0f0f',
          800: '#0a0a0a',
          900: '#050505',
          950: '#000000',
        },
        slate: {
          muted: '#64748b',
          light: '#94a3b8',
          dark: '#334155',
        },
        gold: {
          100: '#f9f5e8',
          200: '#f0e6c5',
          300: '#e5d19a',
          400: '#dcb866',
          500: '#D4AF37', // Brushed Gold
          600: '#c29724',
          700: '#987118',
          800: '#765516',
          900: '#634716',
        },
        // ── Light Mode: Museum Gallery ──
        parchment: {
          50:  '#FEFEFE',
          100: '#F9F9F6',
          200: '#F5F5F0', // Primary light bg
          300: '#EEEDE6',
          400: '#E4E2D8',
          500: '#D8D5C8',
          600: '#C4C0AF',
        },
        slate2: {
          900: '#1E293B', // darkest text on light bg
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#94A3B8',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'timeline-flow': 'flow 20s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionDuration: {
        '700': '700ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
