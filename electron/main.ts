import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import Datastore from 'nedb';
import { pathToFileURL } from 'url';

// ----------------------------------------------------
// 【路径定义】: DIST 路径定义
// ----------------------------------------------------
const DIST_ROOT = path.join(__dirname, '..', 'dist');


// 获取应用数据路径，确保数据库文件存储在安全位置
const userDataPath = app.getPath('userData');

// 数据库集合的映射
const dbs: { [key: string]: Datastore } = {
  // 训练记录集合
  training: new Datastore({ 
    filename: path.join(userDataPath, 'training.db'), 
    autoload: true 
  }),
  // 身体数据集合（未来使用）
  body: new Datastore({ 
    filename: path.join(userDataPath, 'body.db'), 
    autoload: true 
  }),
  // 身体围度集合
  metrics: new Datastore({
    filename: path.join(userDataPath, 'metrics.db'),
    autoload: true
  }),
};

// ----------------------------------------------------
// NeDB Promise 封装 (保持不变)
// ----------------------------------------------------

function nedbFind(collection: string, query: object): Promise<any[]> {
  return new Promise((resolve, reject) => {
    dbs[collection].find(query).sort({ createdAt: -1 }).exec((err, docs) => {
      if (err) return reject(err);
      resolve(docs);
    });
  });
}

function nedbInsert(collection: string, doc: object): Promise<any> {
    return new Promise((resolve, reject) => {
        dbs[collection].insert({ ...doc, createdAt: new Date() }, (err, newDoc) => {
            if (err) return reject(err);
            resolve(newDoc);
        });
    });
}

function nedbUpdate(collection: string, query: object, update: object, options: object): Promise<number> {
    return new Promise((resolve, reject) => {
        const opts = { multi: false, ...options };
        dbs[collection].update(query, update, opts, (err, numReplaced) => {
            if (err) return reject(err);
            resolve(numReplaced);
        });
    });
}

function nedbRemove(collection: string, query: object, options: object = {}): Promise<number> {
    return new Promise((resolve, reject) => {
        dbs[collection].remove(query, options, (err, numRemoved) => {
            if (err) return reject(err);
            resolve(numRemoved);
        });
    });
}

// ----------------------------------------------------
// IPC 通道处理器 (保持不变)
// ----------------------------------------------------

let ipcHandlersRegistered = false;
function registerIpcHandlers() {
  if (ipcHandlersRegistered) return; // 防止重复注册
  ipcMain.handle('nedb:find', (event, collection: string, query: object) => {
    if (!dbs[collection]) return Promise.reject(new Error(`Collection ${collection} not found`));
    return nedbFind(collection, query);
  });
  
  ipcMain.handle('nedb:insert', (event, collection: string, doc: object) => {
    if (!dbs[collection]) return Promise.reject(new Error(`Collection ${collection} not found`));
    return nedbInsert(collection, doc);
  });
  
  ipcMain.handle('nedb:update', (event, collection: string, query: object, update: object, options: object) => {
    if (!dbs[collection]) return Promise.reject(new Error(`Collection ${collection} not found`));
    return nedbUpdate(collection, query, update, options);
  });

  ipcMain.handle('nedb:remove', (event, collection: string, query: object, options: object) => {
    if (!dbs[collection]) return Promise.reject(new Error(`Collection ${collection} not found`));
    return nedbRemove(collection, query, options);
  });
  ipcHandlersRegistered = true;
}

// ----------------------------------------------------
// Electron 窗口创建
// ----------------------------------------------------

function createWindow() {
    // 创建启动屏幕窗口
    const splash = new BrowserWindow({
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
    const splashPath = path.join(app.getAppPath(), 'public', 'splash.html');
    splash.loadURL(pathToFileURL(splashPath).href);

    // 创建主窗口
    const win = new BrowserWindow({
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
            devTools: !app.isPackaged,
            webSecurity: true, 
        },
    });

    // 主窗口准备好显示时，显示主窗口并关闭启动屏幕
    win.once('ready-to-show', () => {
        splash.destroy(); // 关闭启动屏幕
        win.show(); // 显示主窗口
    });

    if (!app.isPackaged) {
        win.webContents.openDevTools();
        win.loadURL('http://localhost:5173/');
    } else {
        const indexPath = path.join(DIST_ROOT, 'index.html');
        const fileUrl = pathToFileURL(indexPath).href; 
        win.loadURL(fileUrl).catch(err => {
            console.error(`Failed to load index.html from URL: ${fileUrl}`, err);
        });
    }

    try {
        Menu.setApplicationMenu(null);
        win.setMenuBarVisibility(false);
    } catch (e) {
        console.warn('Failed to hide menu bar:', e);
    }
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
