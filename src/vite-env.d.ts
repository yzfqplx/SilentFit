// src/vite-env.d.ts

// ----------------------------------------------------
// 1. Vite 客户端环境声明 (您已提供的内容)
// ----------------------------------------------------
interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL: string;
  // ... 其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
// ----------------------------------------------------

// 模块导入声明
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.svg';
declare module '*.jpg';

// ----------------------------------------------------
// 2. Electron Data API 全局类型声明 (【关键修复】)
// ----------------------------------------------------

// 接口定义必须与 electron/preload.ts 中暴露的 DataAPI 结构匹配
interface DataAPI {
  find: (collection: string, query: object) => Promise<any[]>;
  insert: (collection: string, doc: object) => Promise<any>;
  update: (collection: string, query: object, update: object, options: object) => Promise<number>;
  remove: (collection: string, query: object, options: object) => Promise<number>;
}

// 声明全局的 window 接口，告诉 TypeScript 编译器 window 上存在 api 属性
declare global {
  interface Window {
    api: DataAPI;
    // Android 状态栏 JavaScript 接口
    AndroidStatusBar?: {
      setStyle: (isDark: boolean) => void;
    };
    // Android 分享 JavaScript 接口
    AndroidShare?: {
      shareFile: (filePath: string, title: string, text: string) => void;
    };
  }
}

// 确保此文件被视为模块
export { };