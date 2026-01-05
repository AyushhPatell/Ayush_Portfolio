/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Tech Scheme (navy + cyan)
        'deep-navy': '#1a1f3a',
        'deep-blue': '#2d3561',
        'tech-cyan': '#06b6d4',
        'tech-blue': '#3b82f6',
        // Vibrant Energy Scheme (purple + neon cyan)
        'vibrant-purple': '#7c3aed',
        'vibrant-purple-light': '#8b5cf6',
        'neon-cyan': '#00f3ff',
        // Elegant Contrast Scheme (dark + gold/teal)
        'elegant-dark': '#0f0f23',
        'elegant-gold': '#d4af37',
        'elegant-teal': '#14b8a6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

