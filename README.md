# SilentFit

<div align="center">

**全面的力量训练追踪与理论学习平台**

[![Version](https://img.shields.io/badge/version-1.1.0--Alpha-blue.svg)](https://github.com/yzfqplx/SilentFit)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)

</div>

## 📝 项目简介

**SilentFit** 是一个现代化的力量训练管理应用，专注于帮助用户科学地追踪训练数据、理解训练理论、制定个性化计划。通过数据可视化、智能推荐和交互式知识图谱，让力量训练过程更加透明和高效。

### 核心特性

- 🎯 **数据驱动管理** - 精确记录和分析训练数据，实时追踪进度
- 📚 **理论实践结合** - 交互式知识图谱，深入理解训练科学
- 📅 **智能计划系统** - 个性化训练计划，支持日期、重复和提醒设置
- 📊 **可视化分析** - 多维度图表展示训练趋势和身体数据
- 🎨 **现代化界面** - 支持浅色/深色主题，流畅的用户体验
- 🚀 **跨平台支持** - 基于 Tauri 2.0，支持 Windows、macOS、Linux 和 Android

## ✨ 主要功能

### 训练管理
- ✅ **训练计划** - 创建和管理训练计划，记录训练项目、组数、次数、重量等详细数据
- ✅ **计划功能** - 支持日期选择、重复模式（每天、每周等）和智能提醒
- ✅ **训练执行** - 完成训练后标记完成，自动生成训练数据并同步到图表
- ✅ **身体围度** - 追踪身体各部位围度变化

### 数据可视化
- 📈 **训练趋势图** - 动态展示各训练项目的进度趋势
- 💪 **最大力量记录** - 追踪个人最佳成绩 (1RM)
- 📊 **活动强度分析** - 可视化训练量和训练频率
- 🎯 **动态数据源** - 图表数据基于完成的训练计划动态生成

### 理论学习
- 🧠 **知识图谱** - 交互式探索力量训练概念、原则和目标
- 📖 **理论指导** - 深入理解训练背后的科学原理

### 用户体验
- 🎨 **主题切换** - 浅色/深色模式无缝切换
- 📱 **响应式设计** - 适配桌面和移动设备
- 🔔 **智能提醒** - 训练计划提醒功能
- 💾 **数据导出** - 支持导出和分享训练数据 (使用 Tauri 原生 API)

## 🛠️ 技术栈

### 前端框架
- **React 19.2** - 现代化的 UI 框架
- **TypeScript** - 类型安全的开发体验
- **Vite** - 快速的构建工具

### UI 组件
- **Shadcn UI** - 无障碍的组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 精美的图标库
- **Recharts** - 强大的图表库
- **React Flow** - 知识图谱可视化

### 跨平台
- **Tauri 2.0** - 轻量级的桌面和移动应用框架
  - 桌面支持: Windows, macOS, Linux
  - 移动支持: Android
- **NeDB** - 嵌入式数据库

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 pnpm
- Rust (用于 Tauri 开发)
- Android Studio (用于 Android 开发)

### 安装步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/yzfqplx/SilentFit.git
cd SilentFit
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 开发模式

**Web 开发服务器**
```bash
npm run dev
```
访问 http://localhost:5173

**Tauri 桌面应用**
```bash
npm run tauri:dev
```

**Tauri Android 应用**
```bash
# 首次运行需要添加 Android 目标
npm run tauri android init

# 开发模式
npm run tauri android dev
```

#### 4. 生产构建

**桌面应用**
```bash
npm run tauri:build
```

**Android 应用**
```bash
npm run tauri android build
```


## 📖 使用指南

#### 1. 创建和管理训练计划

1. 进入 **"训练计划"** 页面
2. 点击 **"新建计划"** 按钮
3. 设置计划详情：
   - 选择训练项目（如深蹲、卧推、硬拉等）
   - 设置目标组数、次数和重量
   - 选择计划日期
   - 配置重复模式（每天、每周、自定义等）
   - 设置提醒时间（可选）
4. 完成训练后：
   - 点击计划项进入详情页
   - 填写实际完成的组数、次数和重量
   - 标记为完成，数据会自动生成并同步到图表分析

### 2. 查看数据分析

在 **"仪表盘"** 页面，您可以：
- 📊 查看关键绩效指标（KPIs）
- 📈 浏览训练趋势图（基于已完成的训练计划动态生成）
- 💪 追踪个人最大力量记录
- 📉 分析训练量和强度变化

### 3. 探索训练理论

访问 **"健身理论"** 页面：
- 通过交互式知识图谱探索力量训练概念
- 点击节点查看详细解释
- 理解不同训练原则之间的关联

### 4. 追踪身体数据

在 **"身体围度"** 页面：
- 记录各部位围度数据
- 查看身体变化趋势
- 对比不同时间段的数据


## 📸 应用截图

以下是 SilentFit 应用程序的一些界面截图：

### 仪表盘
![仪表盘](https://github.com/user-attachments/assets/9f552b8f-e836-4dbd-af39-6b2ef489238f)

### 训练计划
![训练计划](https://github.com/user-attachments/assets/0765f4db-2a53-4f86-979f-07a10d291370)

### 身体围度
![身体围度](https://github.com/user-attachments/assets/ffe8ee04-979c-4e96-aae3-810d059ecd13)

### 健身理论
![健身理论](https://github.com/user-attachments/assets/3f560b38-e17f-441f-8885-ed861ca0ba8c)

### 设置
![设置](https://github.com/user-attachments/assets/8e3b4f25-da7e-454a-b7c8-2fe204d73337)


## 🤝 贡献指南

我们欢迎并感谢任何形式的贡献！无论是报告 Bug、提出新功能建议，还是提交代码改进，都对项目的发展至关重要。

### 如何贡献

1. **Fork 本仓库**
   - 点击页面右上角的 "Fork" 按钮

2. **克隆您的 Fork**
   ```bash
   git clone https://github.com/你的用户名/SilentFit.git
   cd SilentFit
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或修复 Bug
   git checkout -b fix/bug-description
   ```

4. **进行更改**
   - 编写清晰、可维护的代码
   - 遵循项目现有的代码风格
   - 添加必要的注释和文档

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加某个功能"
   # 或
   git commit -m "fix: 修复某个问题"
   ```

6. **推送到您的 Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **创建 Pull Request**
   - 返回 GitHub 上的原仓库
   - 点击 "New Pull Request"
   - 详细描述您的更改

### 提交信息规范

请使用以下格式编写提交信息：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 代码规范

- 使用 TypeScript 进行类型安全开发
- 运行 `npm run lint` 检查代码风格
- 确保代码通过所有现有测试
- 为新功能添加适当的测试

## 🐛 问题反馈

如果您发现 Bug 或有功能建议，请：

1. 在 [Issues](https://github.com/yzfqplx/SilentFit/issues) 页面搜索是否已有相关问题
2. 如果没有，创建新的 Issue
3. 提供详细的描述和复现步骤（如适用）

## 📄 许可证

本项目采用 **GNU General Public License v3.0** 许可证。

这意味着：
- ✅ 可以自由使用、修改和分发
- ✅ 可以用于商业目的
- ⚠️ 修改后的版本必须开源
- ⚠️ 必须保留原作者版权信息

详细信息请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐️**

Made with ❤️ by [yzfqplx](https://github.com/yzfqplx)

</div>

