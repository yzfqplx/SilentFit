# Tauri 后端功能完善

## 📋 概述
已完成从 Capacitor 到 Tauri 2.0 的完整迁移，并添加了文件导出和分享功能。

## ✅ 已完成的更改

### 1. 平台检测 (App.tsx)
- ✅ 移除 Capacitor 依赖
- ✅ 使用 `'__TAURI__' in window` 检测 Tauri 环境
- ✅ 使用 `navigator.userAgent` 检测 Android/iOS
- ✅ 添加调试日志

### 2. Rust 后端命令 (commands.rs)

#### 新增命令：

**export_data**
```rust
pub fn export_data(app_handle: AppHandle, data: String, filename: String) -> Result<String, String>
```
- 功能：将数据导出到下载目录
- 返回：文件路径
- 使用：`fileApi.exportData(jsonString, fileName)`

**share_file**
```rust
pub async fn share_file(app_handle: AppHandle, file_path: String, title: String, text: String) -> Result<(), String>
```
- 功能：在 Android 上触发分享事件
- 平台：仅在 Android 上有效
- 使用：`fileApi.shareFile(filePath, title, text)`

### 3. 前端 API (tauri.ts)

新增 `fileApi`:
```typescript
export const fileApi = {
  exportData: (data: string, filename: string) => invoke<string>('export_data', { data, filename }),
  shareFile: (filePath: string, title: string, text: string) => invoke('share_file', { filePath, title, text }),
};
```

### 4. 设置页面 (SettingsPage.tsx)

更新 `handleExportData`:
- ✅ 使用 Tauri 后端 API 导出文件
- ✅ 在 Android 上自动触发分享
- ✅ 在其他平台上显示文件路径
- ✅ 在 Web 上使用浏览器下载

### 5. Android 配置

**MainActivity.kt**
- ✅ 添加文件分享功能
- ✅ 使用 FileProvider 安全分享文件
- ✅ 支持 Intent.ACTION_SEND

**file_paths.xml**
- ✅ 配置文件访问路径
- ✅ 支持外部存储、缓存等多种路径

**AndroidManifest.xml**
- ✅ FileProvider 已配置（无需修改）

## 🔧 使用方法

### 导出数据
```typescript
const data = { heightCm, records, metrics };
const jsonString = JSON.stringify(data, null, 2);
const filePath = await fileApi.exportData(jsonString, 'fitness_tracker_data.json');
console.log('文件已保存到:', filePath);
```

### 分享文件 (Android)
```typescript
await fileApi.shareFile(
  filePath,
  '健身追踪器数据',
  '这是您的健身追踪器数据备份。'
);
```

## 📱 平台支持

| 功能 | Web | Desktop | Android | iOS |
|------|-----|---------|---------|-----|
| 导出到下载目录 | ❌ | ✅ | ✅ | ✅ |
| 浏览器下载 | ✅ | ✅ | ✅ | ✅ |
| 系统分享 | ❌ | ❌ | ✅ | 🔄 |

✅ = 已实现  
❌ = 不支持  
🔄 = 待实现

## 🚀 后续优化建议

### 1. Android 分享集成
目前 Android 分享使用事件系统，可以进一步优化：
- 使用 Tauri 插件系统
- 直接从 Rust 调用 Android API
- 添加分享回调

### 2. iOS 支持
- 实现 iOS 分享功能
- 使用 UIActivityViewController

### 3. 文件管理
- 添加文件删除功能
- 添加文件列表查看
- 支持导入文件选择

### 4. 错误处理
- 添加更详细的错误信息
- 添加重试机制
- 添加用户友好的错误提示

## 🐛 已知问题

1. **Android 分享事件**
   - 当前使用事件系统，需要在 MainActivity 中监听
   - 建议使用 Tauri 插件系统替代

2. **文件权限**
   - 确保应用有存储权限
   - FileProvider 配置正确

## 📝 测试清单

- [ ] Web 浏览器下载
- [ ] Desktop 文件导出
- [ ] Android 文件导出
- [ ] Android 分享功能
- [ ] 文件路径正确性
- [ ] 错误处理
- [ ] 跨平台兼容性

## 🔗 相关文件

- `/src-tauri/src/commands.rs` - Rust 后端命令
- `/src-tauri/src/lib.rs` - 命令注册
- `/src/lib/tauri.ts` - 前端 API
- `/src/pages/SettingsPage.tsx` - 设置页面
- `/src/App.tsx` - 平台检测
- `/src-tauri/gen/android/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt` - Android 主活动
- `/src-tauri/gen/android/app/src/main/res/xml/file_paths.xml` - FileProvider 配置
