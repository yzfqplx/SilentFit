// electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

// ----------------------------------------------------
// API 接口定义 (为了类型安全，在渲染进程中使用)
// ----------------------------------------------------

export type DataAPI = {
  find: (collection: string, query: object) => Promise<any[]>;
  insert: (collection: string, doc: object) => Promise<any>;
  update: (collection: string, query: object, update: object, options: object) => Promise<number>;
  remove: (collection: string, query: object, options: object) => Promise<number>;
};

// ----------------------------------------------------
// 暴露 API
// ----------------------------------------------------

// 通过 contextBridge 将 API 暴露给 React 渲染进程 (在 window.api 下)
contextBridge.exposeInMainWorld('api', {
  find: (collection: string, query: object) => ipcRenderer.invoke('nedb:find', collection, query),
  insert: (collection: string, doc: object) => ipcRenderer.invoke('nedb:insert', collection, doc),
  update: (collection: string, query: object, update: object, options: object) => 
    ipcRenderer.invoke('nedb:update', collection, query, update, options),
  remove: (collection: string, query: object, options: object) => 
    ipcRenderer.invoke('nedb:remove', collection, query, options),
});