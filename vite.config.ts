import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { builtinModules } from 'module';

// https://vitejs.dev/config/
export default defineConfig({
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
      external: [...builtinModules],
    },
    chunkSizeWarningLimit: 2000, // 增加 chunk 大小警告的限制为 2000 KB
  },
});