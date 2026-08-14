export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* === Macaron palette === */
        macaron: {
          bg: '#f5f0ff',        /* 背景：淡紫灰 */
          card: '#ffffff',       /* 卡片：纯白 */
          cardAlt: '#faf7ff',    /* 卡片次色 */
          purple: '#6c5ce7',
          yellow: '#ffd93d',
          mint: '#55efc4',
          pink: '#ff7675',
          blue: '#74b9ff',
          coral: '#fab1a0',
          lemon: '#fff3a8',
          lavender: '#a29bfe',
          peach: '#ffeaa7',
        },
        /* === Legacy warm/sky/mint — kept for backward compat === */
        warm: { orange: '#FF9F43', yellow: '#FECA57' },
        sky: { blue: '#54A0FF' },
        mint: '#5F9EA0',
        pink: '#FF6B6B',
        bg: { cream: '#FFF8E7', lightblue: '#F0F8FF' },
      },
      fontFamily: {
        cn: ['"LXGW WenKai"', 'sans-serif'],
        en: ['Fredoka', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '18px',
        '2xl': '24px',
        '3xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        /* === Soft UI 双层阴影 === */
        'soft': '0 8px 24px rgba(108, 92, 231, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 48px rgba(108, 92, 231, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'soft-sm': '0 4px 12px rgba(108, 92, 231, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'soft-hover': '0 20px 60px rgba(108, 92, 231, 0.16), 0 6px 18px rgba(0, 0, 0, 0.08)',
        'inset-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        /* 拟物凸起 */
        'neo-up': '4px 4px 0 #6c5ce7, -4px -4px 0 #ffffff',
        'neo-down': 'inset 4px 4px 0 #6c5ce7, inset -4px -4px 0 #ffffff',
        /* Legacy */
        'q': '0 4px 12px rgba(0,0,0,0.1)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'pop-in': 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
