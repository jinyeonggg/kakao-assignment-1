import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#672be0',
        'primary-hover': '#7d3ef5',
        'primary-dim': '#672be022',
        surface: '#ffffff',
        'app-bg': '#f7f5ff',
        border: '#e4ddf7',
        'text-main': '#1a1025',
        'text-muted': '#9385b0',
        'text-done': '#b0a4cc',
        danger: '#e0365a',
        'danger-hover': '#c2294a',
        select: '#3b82f6',
      },
      borderRadius: {
        card: '18px',
        item: '12px',
        btn: '8px',
        input: '10px',
      },
      boxShadow: {
        card: '0 8px 40px rgba(103,43,224,0.10)',
        btn: '0 2px 8px rgba(103,43,224,0.25)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        itemIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'item-in': 'itemIn 0.25s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
