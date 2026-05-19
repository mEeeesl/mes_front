// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Next.js 프로젝트 구조에 맞게 조정
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'], // 폰트 설정을 했다면 해당 변수 사용
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      keyframes: {
        'slide-down-full': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-up-full': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'image-scale-up': {
            '0%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1.0)' },
        },
      },
      animation: {
        'slide-down-full': 'slide-down-full 1.5s ease-out forwards',
        'slide-up-full': 'slide-up-full 1.5s ease-out forwards',
        'image-scale-up': 'image-scale-up 2.5s ease-out forwards',
      },
      transitionDuration: {
        '1500': '1500ms',
      }
    },
  },
  plugins: [],
}