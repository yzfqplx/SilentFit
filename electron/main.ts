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
    
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        // Windows: 隐藏菜单栏（Alt 可暂时显示，或通过 setMenuBarVisibility(false) 完全隐藏）
        autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'), 
                devTools: true,
                
                // 恢复默认 webSecurity，因为它现在应该能正常工作了
                webSecurity: true,
            },
    });

    // 【核心修复】: 使用 app.isPackaged 替代可能错误的环境变量
    if (!app.isPackaged) {
        // 开发环境：加载 Vite 服务器地址
        win.webContents.openDevTools();
        win.loadURL('http://localhost:5173/');
    } else {
        // 生产环境：加载构建后的 HTML 文件
        const indexPath = path.join(DIST_ROOT, 'index.html');
        
        // 使用 loadURL 和 pathToFileURL 确保路径格式正确
        const fileUrl = pathToFileURL(indexPath).href; 
        console.log(`[Prod Load] Attempting to load URL: ${fileUrl}`); 

        win.loadURL(fileUrl).catch(err => {
            console.error(`Failed to load index.html from URL: ${fileUrl}`, err);
        });
    }



    // 移除应用菜单（特别是 Windows 的 File/Edit/View 菜单）
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
