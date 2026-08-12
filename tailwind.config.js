export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: { orange: '#FF9F43', yellow: '#FECA57' },
        sky: { blue: '#54A0FF' },
        mint: '#5F9EA0',
        pink: '#FF6B6B',
        bg: { cream: '#FFF8E7', lightblue: '#F0F8FF' }
      },
      fontFamily: {
        cn: ['"ZCOOL KuaiLe"', '"LXGW WenKai"', 'sans-serif'],
        en: ['Fredoka', 'Nunito', 'sans-serif']
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px'
      },
      boxShadow: {
        'q': '0 4px 12px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
}
