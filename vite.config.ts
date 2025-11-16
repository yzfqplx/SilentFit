import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { builtinModules } from 'module'; // 导入 Node.js 内置模块列表

// https://vitejs.dev/config/
export default defineConfig({
  // **【关键修复点】**：设置基础路径为相对路径 './'
  // 确保在生产环境 (file://协议) 中资源加载正确，解决空白页问题。
  base: './', 
  
  plugins: [react()],
  
  resolve: {
    alias: {
      // 确保正确解析路径
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  
  build: {
    // 设置构建输出目录
    outDir: 'dist', 
    // 明确设置 target，以确保兼容性
    target: 'es2022', 
    
    rollupOptions: {
      // 【关键】: 告诉 Rollup/Vite 忽略 Node.js 内置模块
      // 防止在打包前端代码时尝试打包 Node 模块
      external: [...builtinModules],
    },
    chunkSizeWarningLimit: 1000, // 增加 chunk 大小警告的限制为 1000 KB
  },
});