import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kakao: {
          bg: "#b2c7d9", // Main chat background (light blue-gray)
          bgDark: "#9db4c8", // Darker variant
          yellow: "#ffe500", // User message bubble
          yellowDark: "#f7d600", // User message hover
          white: "#ffffff", // AI message bubble
          gray: "#f5f5f5", // Light gray
          lightGray: "#e9ecef", // Very light gray
          darkGray: "#8e8e93", // Secondary text
          text: "#191919", // Primary text
          purple: "#7c6bdb", // AI avatar
          border: "#d1dae0", // Borders
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
