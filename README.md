# 项目名称：SilentFit

## 📝 描述

**SilentFit** 是一个全面的力量健身追踪与理论学习平台，旨在帮助用户科学地管理力量健身数据，理解力量健身理论，并制定个性化的力量训练计划。它结合了数据可视化、智能推荐和知识图谱等功能，让力量健身过程更透明、更高效。

**核心目标：**
*   **数据驱动的力量健身管理：** 记录并分析用户的训练数据，提供直观的力量健身进度概览。
*   **理论与实践结合：** 通过互动式知识图谱，帮助用户理解力量健身背后的科学原理。
*   **个性化训练计划：** 根据用户数据和力量健身目标，提供智能化的训练建议。
*   **多平台支持：** 提供跨平台体验，无论是在桌面还是移动设备上都能轻松使用。

## ✨ 主要功能

*   **力量健身数据追踪：** 记录力量训练、有氧运动、身体指标等多种数据。
*   **训练计划管理：** 创建、编辑和跟踪个性化训练计划。
*   **数据可视化：** 通过图表展示力量健身趋势、最大力量记录和活动强度。
*   **力量健身理论知识图谱：** 互动式地探索力量健身概念、原则和目标之间的关系。
*   **智能推荐系统：** 基于用户数据和理论知识提供训练和营养建议。
*   **用户友好的界面：** 直观、简洁的设计，提供流畅的用户体验。
*   **跨平台兼容：** 支持桌面应用 (Electron) 和移动应用 (Capacitor)。
*   **主题切换：** 提供浅色和深色主题模式。

## 🚀 快速开始

### 安装

#### 1. 克隆仓库

```bash
git clone https://github.com/[您的GitHub用户名]/SilentFit.git
cd SilentFit
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 运行开发服务器 (Web)

```bash
npm run dev
```

#### 4. 运行 Electron 桌面应用

```bash
npm run electron:dev
```

#### 5. 构建移动应用 (Capacitor)

**a. 添加平台 (如果尚未添加)**

```bash
npx cap add android # 或 npx cap add ios
```

**b. 构建 Web 资产**

```bash
npm run build
```

**c. 同步到原生项目**

```bash
npx cap sync
```

**d. 打开原生项目**

```bash
npx cap open android # 或 npx cap open ios
```

### 使用示例

#### 1. 记录训练

在应用中导航到“训练记录”页面，点击“添加训练”按钮。填写您的训练项目、组数、次数和重量，然后保存。应用将自动计算您的训练量并更新进度。

#### 2. 探索力量健身理论

访问“力量健身理论”页面，通过交互式知识图谱探索不同的力量健身概念。点击节点查看详细解释，理解它们之间的关联。

#### 3. 查看数据仪表盘

在“仪表盘”页面，您可以概览您的关键绩效指标 (KPIs)、训练趋势图和最大力量记录。这些图表将帮助您直观地了解自己的力量健身进展。

## 📸 应用截图

以下是 SilentFit 应用程序的一些界面截图：

### 仪表盘
![仪表盘](https://github.com/user-attachments/assets/9f552b8f-e836-4dbd-af39-6b2ef489238f)

### 训练记录
![训练记录](https://github.com/user-attachments/assets/46e134d6-57e1-407b-b82d-026c22460e95)

### 训练计划
![训练计划](https://github.com/user-attachments/assets/0765f4db-2a53-4f86-979f-07a10d291370)

### 身体围度
![身体围度](https://github.com/user-attachments/assets/ffe8ee04-979c-4e96-aae3-810d059ecd13)

### 健身理论
![健身理论](https://github.com/user-attachments/assets/3f560b38-e17f-441f-8885-ed861ca0ba8c)

### 设置
![设置](https://github.com/user-attachments/assets/8e3b4f25-da7e-454a-b7c8-2fe204d73337)

## 🤝 贡献

我们欢迎并感谢任何形式的贡献！如果您有兴趣改进 SilentFit，请遵循以下步骤：

1.  **Fork** 本仓库。
2.  创建您的功能分支 (`git checkout -b feature/AmazingFeature`)。
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4.  推送到分支 (`git push origin feature/AmazingFeature`)。
5.  打开一个 **Pull Request**。

请确保您的代码符合项目现有的编码规范，并包含适当的测试。

## 📄 许可证

本项目根据 GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 发布。
有关更多信息，请参阅 [`LICENSE`](LICENSE) 文件。

