"use strict";
// electron/preload.ts
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// ----------------------------------------------------
// 暴露 API
// ----------------------------------------------------
// 通过 contextBridge 将 API 暴露给 React 渲染进程 (在 window.api 下)
electron_1.contextBridge.exposeInMainWorld('api', {
    find: (collection, query) => electron_1.ipcRenderer.invoke('nedb:find', collection, query),
    insert: (collection, doc) => electron_1.ipcRenderer.invoke('nedb:insert', collection, doc),
    update: (collection, query, update, options) => electron_1.ipcRenderer.invoke('nedb:update', collection, query, update, options),
    remove: (collection, query, options) => electron_1.ipcRenderer.invoke('nedb:remove', collection, query, options),
});
electron_1.contextBridge.exposeInMainWorld('theme', {
    set: (theme) => electron_1.ipcRenderer.invoke('theme:set', theme),
    get: () => electron_1.ipcRenderer.invoke('theme:get'),
});
