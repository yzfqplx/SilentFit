/** @type {import('tailwindcss').Config} */
export default {
  // 扫描 src 文件夹下所有 .html, .js, .jsx, .ts, .tsx 文件中的 Tailwind 类名
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 在这里可以定义您的主色调、字体等
      colors: {
        'primary-blue': '#1e40af', // 强调色
        'card-bg': '#ffffff', // 卡片背景色
        'dark-card-bg': '#1f2937', // 深色模式的卡片背景
      },
      boxShadow: {
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}