// electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';
import type { DataAPI } from '../src/types/data'; // 从 src/types/data.ts 导入 DataAPI

// ----------------------------------------------------
// API 接口定义 (为了类型安全，在渲染进程中使用)
// ----------------------------------------------------

export type ThemeAPI = {
  set: (theme: string) => Promise<void>;
  get: () => Promise<string | null>;
};

// ----------------------------------------------------
// 暴露 API
// ----------------------------------------------------

// 通过 contextBridge 将 API 暴露给 React 渲染进程 (在 window.api 下)
contextBridge.exposeInMainWorld('api', <DataAPI>{
  find: (collection: string, query: object) => ipcRenderer.invoke('nedb:find', collection, query),
  insert: (collection: string, doc: object) => ipcRenderer.invoke('nedb:insert', collection, doc),
  update: (collection: string, query: object, update: object, options: object) => 
    ipcRenderer.invoke('nedb:update', collection, query, update, options),
  remove: (collection: string, query: object, options: object) => 
    ipcRenderer.invoke('nedb:remove', collection, query, options),
  clearCollection: (collection: string) => ipcRenderer.invoke('nedb:clearCollection', collection),
  bulkInsert: (collection: string, docs: any[]) => ipcRenderer.invoke('nedb:bulkInsert', collection, docs),
});

contextBridge.exposeInMainWorld('theme', {
  set: (theme: string) => ipcRenderer.invoke('theme:set', theme),
  get: () => ipcRenderer.invoke('theme:get'),
});
