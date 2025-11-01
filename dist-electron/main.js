"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const nedb_1 = __importDefault(require("nedb"));
const url_1 = require("url");
// ----------------------------------------------------
// 【路径定义】: DIST 路径定义
// ----------------------------------------------------
const DIST_ROOT = path.join(__dirname, '..', 'dist');
// 获取应用数据路径，确保数据库文件存储在安全位置
const userDataPath = electron_1.app.getPath('userData');
// 数据库集合的映射
const dbs = {
    // 训练记录集合
    training: new nedb_1.default({
        filename: path.join(userDataPath, 'training.db'),
        autoload: true
    }),
    // 身体数据集合（未来使用）
    body: new nedb_1.default({
        filename: path.join(userDataPath, 'body.db'),
        autoload: true
    }),
    // 身体围度集合
    metrics: new nedb_1.default({
        filename: path.join(userDataPath, 'metrics.db'),
        autoload: true
    }),
};
// ----------------------------------------------------
// NeDB Promise 封装 (保持不变)
// ----------------------------------------------------
function nedbFind(collection, query) {
    return new Promise((resolve, reject) => {
        dbs[collection].find(query).sort({ createdAt: -1 }).exec((err, docs) => {
            if (err)
                return reject(err);
            resolve(docs);
        });
    });
}
function nedbInsert(collection, doc) {
    return new Promise((resolve, reject) => {
        dbs[collection].insert({ ...doc, createdAt: new Date() }, (err, newDoc) => {
            if (err)
                return reject(err);
            resolve(newDoc);
        });
    });
}
function nedbUpdate(collection, query, update, options) {
    return new Promise((resolve, reject) => {
        const opts = { multi: false, ...options };
        dbs[collection].update(query, update, opts, (err, numReplaced) => {
            if (err)
                return reject(err);
            resolve(numReplaced);
        });
    });
}
function nedbRemove(collection, query, options = {}) {
    return new Promise((resolve, reject) => {
        dbs[collection].remove(query, options, (err, numRemoved) => {
            if (err)
                return reject(err);
            resolve(numRemoved);
        });
    });
}
// ----------------------------------------------------
// IPC 通道处理器 (保持不变)
// ----------------------------------------------------
let ipcHandlersRegistered = false;
function registerIpcHandlers() {
    if (ipcHandlersRegistered)
        return; // 防止重复注册
    electron_1.ipcMain.handle('nedb:find', (event, collection, query) => {
        if (!dbs[collection])
            return Promise.reject(new Error(`Collection ${collection} not found`));
        return nedbFind(collection, query);
    });
    electron_1.ipcMain.handle('nedb:insert', (event, collection, doc) => {
        if (!dbs[collection])
            return Promise.reject(new Error(`Collection ${collection} not found`));
        return nedbInsert(collection, doc);
    });
    electron_1.ipcMain.handle('nedb:update', (event, collection, query, update, options) => {
        if (!dbs[collection])
            return Promise.reject(new Error(`Collection ${collection} not found`));
        return nedbUpdate(collection, query, update, options);
    });
    electron_1.ipcMain.handle('nedb:remove', (event, collection, query, options) => {
        if (!dbs[collection])
            return Promise.reject(new Error(`Collection ${collection} not found`));
        return nedbRemove(collection, query, options);
    });
    ipcHandlersRegistered = true;
}
// ----------------------------------------------------
// Electron 窗口创建
// ----------------------------------------------------
function createWindow() {
    // 创建启动屏幕窗口
    const splash = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false,
        },
    });
    // 加载启动屏幕 HTML 文件
    const splashPath = path.join(electron_1.app.getAppPath(), 'public', 'splash.html');
    splash.loadURL((0, url_1.pathToFileURL)(splashPath).href);
    // 创建主窗口
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false, // 初始时隐藏主窗口
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: !electron_1.app.isPackaged,
            webSecurity: true,
        },
    });
    // 主窗口准备好显示时，显示主窗口并关闭启动屏幕
    win.once('ready-to-show', () => {
        splash.destroy(); // 关闭启动屏幕
        win.show(); // 显示主窗口
    });
    if (!electron_1.app.isPackaged) {
        win.webContents.openDevTools();
        win.loadURL('http://localhost:5173/');
    }
    else {
        const indexPath = path.join(DIST_ROOT, 'index.html');
        const fileUrl = (0, url_1.pathToFileURL)(indexPath).href;
        win.loadURL(fileUrl).catch(err => {
            console.error(`Failed to load index.html from URL: ${fileUrl}`, err);
        });
    }
    try {
        electron_1.Menu.setApplicationMenu(null);
        win.setMenuBarVisibility(false);
    }
    catch (e) {
        console.warn('Failed to hide menu bar:', e);
    }
}
electron_1.app.whenReady().then(() => {
    registerIpcHandlers();
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
