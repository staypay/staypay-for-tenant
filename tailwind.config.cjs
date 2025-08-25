/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mobile': '390px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      screens: {
        DEFAULT: '390px',
      },
    },
    extend: {
      fontFamily: {
        'pretendard': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
        'sans': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      colors: {
        // StayPay Brand Colors from Figma
        primary: '#1E64DD',
        secondary: '#379AE6',
        success: '#1EDDC7',
        danger: '#E41014',
        warning: '#FF4D4D',
        
        // Text Colors
        text: {
          primary: '#171A1F',
          secondary: '#323842',
          tertiary: '#565E6C',
          muted: '#9095A0',
          light: '#BCC1CA',
        },
        
        // Background Colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F3F4F6',
          border: '#DEE1E6',
        },
        
        // Status Colors
        status: {
          pending: '#79859A',
          active: '#1E64DD',
          complete: '#1EDDC7',
          error: '#E41014',
        },
        
        // Keep original for compatibility
        gray: '#79859A',
        white: '#FFFFFF',
        black: '#171A1F',
        // Keep original color scales for compatibility
        'primary-scale': {
          50: '#e6f2fb',
          100: '#cce5f7',
          200: '#99cbef',
          300: '#66b1e7',
          400: '#3397df',
          500: '#0A64BC',
          600: '#085196',
          700: '#063d71',
          800: '#04294b',
          900: '#021426',
        },
        'gray-scale': {
          50: '#f4f5f7',
          100: '#e9ebef',
          200: '#d3d7df',
          300: '#bdc3cf',
          400: '#a7afbf',
          500: '#79859A',
          600: '#616b7b',
          700: '#49515c',
          800: '#30363e',
          900: '#181b1f',
        },
      },
      maxWidth: {
        'mobile': '390px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

