# 🎯 TypeScript 全栈卡片系统

一个基于 TypeScript 的现代化全栈开发模板，展示可配置卡片系统，支持 Web、iOS 和 Android 多平台。

## ✨ 项目特色

- 🏗️ **Monorepo 架构**：使用 Turborepo 管理多个应用和共享包
- 🚀 **全栈 TypeScript**：前后端统一使用 TypeScript 开发
- 📱 **跨平台支持**：Web (React) + 移动端 (React Native)
- 🎨 **可配置卡片**：支持多种卡片类型（文本、图片、链接、统计、待办事项）
- 🔧 **现代技术栈**：NestJS + Prisma + React + React Native
- 📦 **组件复用**：共享 UI 组件库和类型定义
- 🎭 **美观界面**：现代化 UI 设计，支持响应式布局

## 🏛️ 项目架构

```
nestjs-monorepo/
├── apps/                    # 应用目录
│   ├── api/                # NestJS 后端 API
│   │   ├── src/
│   │   │   ├── cards/      # 卡片管理模块
│   │   │   ├── auth/       # 用户认证模块
│   │   │   ├── tasks/      # 任务管理模块
│   │   │   └── prisma/     # 数据库服务
│   │   └── prisma/         # 数据库配置和迁移
│   ├── web/                # React Web 应用
│   │   └── src/
│   │       ├── components/ # 页面组件
│   │       └── services/   # API 服务
│   └── native/             # React Native 移动应用
│       └── app/
│           └── services/   # API 服务
├── packages/               # 共享包目录
│   ├── shared-types/       # 共享类型定义
│   ├── ui/                 # 共享 UI 组件库
│   └── typescript-config/  # TypeScript 配置
└── turbo.json             # Turborepo 配置
```

## 🛠️ 技术栈

### 后端
- **NestJS** - Node.js 框架，提供企业级架构
- **Prisma** - 类型安全的数据库 ORM
- **SQLite** - 轻量级数据库（可切换为 PostgreSQL/MySQL）
- **TypeScript** - 静态类型检查

### 前端
- **React** - Web 前端框架
- **Vite** - 快速构建工具
- **CSS3** - 现代化样式，支持响应式设计

### 移动端
- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发平台

### 开发工具
- **Turborepo** - 单体仓库构建系统
- **TypeScript** - 类型安全
- **Prettier** - 代码格式化
- **ESLint** - 代码质量检查

## 📋 功能特性

### 🎴 卡片系统
- **多种卡片类型**：
  - 📝 文本卡片 - 自定义文本内容和样式
  - 🖼️ 图片卡片 - 展示图片内容
  - 🔗 链接卡片 - 外部链接预览
  - 📊 统计卡片 - 数据可视化展示
  - ✅ 待办事项卡片 - 任务列表管理

- **卡片管理**：
  - ➕ 创建和删除卡片
  - ✏️ 编辑卡片内容和样式
  - 🎨 自定义卡片样式（颜色、边框、阴影等）
  - 🔄 实时同步更新

### 🌐 多平台支持
- **Web 应用**：响应式设计，支持桌面和移动浏览器
- **iOS 应用**：原生 iOS 体验
- **Android 应用**：原生 Android 体验
- **数据同步**：多平台数据实时同步

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn
- iOS 开发需要 Xcode (仅限 macOS)
- Android 开发需要 Android Studio

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd nestjs-monorepo

# 安装所有依赖
npm install --legacy-peer-deps

# 构建共享包
npm run build
```

### 数据库设置

```bash
# 进入 API 目录
cd apps/api

# 数据库迁移
npx prisma migrate dev

# 生成 Prisma 客户端
npx prisma generate

# 初始化示例数据
npx tsx prisma/seed.ts
```

### 启动开发服务器

在不同的终端窗口中启动各个服务：

```bash
# 启动后端 API (端口 3000)
cd apps/api
npm run start:dev

# 启动 Web 应用 (端口 5173)
cd apps/web
npm run dev

# 启动移动端应用
cd apps/native
npm run dev        # 启动 Expo 开发服务器
npm run ios        # 在 iOS 模拟器中运行
npm run android    # 在 Android 模拟器中运行
```

### 访问应用

- **Web 应用**: http://localhost:5173
- **API 文档**: http://localhost:3000
- **移动端**: 使用 Expo Go 扫描二维码或在模拟器中运行

## 📱 应用截图

### Web 应用
- 响应式卡片网格布局
- 美观的渐变背景设计
- 流畅的动画效果
- 直观的操作界面

### 移动端应用
- 原生移动端体验
- 触摸友好的界面设计
- 下拉刷新功能
- 原生弹窗和提示

## 🔧 开发指南

### 添加新的卡片类型

1. **更新类型定义** (`packages/shared-types/src/index.ts`)：
```typescript
export enum CardType {
  // ... 现有类型
  NEW_TYPE = 'NEW_TYPE',
}

// 添加配置接口
export interface CardConfig {
  // ... 现有配置
  newType?: {
    customProperty: string;
  };
}
```

2. **更新后端服务** (`apps/api/src/cards/cards.service.ts`)：
```typescript
// 在 getDefaultCardsByType 方法中添加默认配置
[CardType.NEW_TYPE]: {
  newType: {
    customProperty: 'default value',
  },
  style: { /* 样式配置 */ },
},
```

3. **更新前端组件** (`packages/ui/src/card.tsx`)：
```typescript
// 在 renderCardContent 中添加新类型渲染逻辑
case CardTypeEnum.NEW_TYPE:
  return renderNewTypeCard();
```

### 自定义样式主题

修改 `apps/web/src/App.css` 和 `apps/native/app/index.tsx` 中的样式配置来自定义主题色彩。

### 数据库架构修改

```bash
# 修改 prisma/schema.prisma 后执行
cd apps/api
npx prisma migrate dev --name "your-migration-name"
npx prisma generate
```

## 📚 API 文档

### 卡片管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/cards` | 获取所有卡片 |
| GET | `/cards/:id` | 获取单个卡片 |
| POST | `/cards` | 创建新卡片 |
| PATCH | `/cards/:id` | 更新卡片 |
| DELETE | `/cards/:id` | 删除卡片 |
| PATCH | `/cards/positions/update` | 更新卡片位置 |
| GET | `/cards/templates` | 获取卡片模板 |
| GET | `/cards/default/:type` | 获取默认配置 |

### 请求示例

```typescript
// 创建文本卡片
POST /cards
{
  "title": "我的文本卡片",
  "description": "这是一个示例文本卡片",
  "type": "TEXT",
  "config": {
    "text": {
      "content": "Hello World!",
      "fontSize": 18,
      "color": "#2c3e50",
      "alignment": "center"
    },
    "style": {
      "backgroundColor": "#ecf0f1",
      "borderRadius": 12,
      "padding": 20,
      "shadow": true
    }
  }
}
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 运行后端测试
cd apps/api
npm run test
npm run test:e2e

# 运行前端测试
cd apps/web
npm run test
```

## 📦 构建和部署

### 构建项目

```bash
# 构建所有应用
npm run build

# 单独构建
cd apps/api && npm run build      # 后端
cd apps/web && npm run build      # Web 前端
cd apps/native && npm run build   # 移动端
```

### 部署建议

- **后端**: 部署到 Railway、Heroku、或 AWS
- **Web 前端**: 部署到 Vercel、Netlify、或 AWS S3
- **移动端**: 构建为 APK/IPA 文件，发布到应用商店

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目使用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [NestJS](https://nestjs.com/) - 强大的 Node.js 框架
- [React](https://reactjs.org/) - 用户界面库
- [React Native](https://reactnative.dev/) - 跨平台移动开发框架
- [Prisma](https://www.prisma.io/) - 现代数据库工具包
- [Turborepo](https://turbo.build/) - 高性能构建系统

## 📞 联系方式

如有问题或建议，请创建 Issue 或联系项目维护者。

---

⭐ 如果这个项目对您有帮助，请给个 Star！
