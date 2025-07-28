# 🚀 NestJS Monorepo 模板使用指南

## 📋 快速开始

### 🎯 选择适合你的方式

#### 方式一：GitHub 模板（推荐）
```bash
# 1. 访问模板仓库
https://github.com/your-username/nestjs-monorepo-template

# 2. 点击 "Use this template" 按钮
# 3. 创建你的新仓库
# 4. 克隆到本地
git clone https://github.com/your-username/your-new-project.git
cd your-new-project

# 5. 运行初始化向导
npm run template:init
```

#### 方式二：NPM Create（即将支持）
```bash
# 创建新项目
npm create nestjs-monorepo my-awesome-project
cd my-awesome-project

# 自动初始化完成，直接开始开发
npm run start
```

#### 方式三：直接克隆
```bash
# 克隆模板
git clone https://github.com/your-username/nestjs-monorepo-template.git my-project
cd my-project

# 清理 git 历史
rm -rf .git
git init

# 初始化项目
npm run template:init
```

---

## 🔧 创建模板仓库

如果你想基于这个项目创建自己的模板：

### 自动化方式（推荐）
```bash
# 运行一键设置脚本
./scripts/setup-github-template.sh
```

### 手动方式
```bash
# 1. 更新 package.json 信息
npm run template:init

# 2. 提交更改
git add .
git commit -m "Initial template setup"

# 3. 创建 GitHub 仓库
gh repo create your-username/nestjs-monorepo-template --public --template

# 4. 推送代码
git remote add origin https://github.com/your-username/nestjs-monorepo-template.git
git push -u origin main
```

---

## 🛠️ 开发流程

### 1. 环境准备
```bash
# 检查 Node.js 版本（需要 >= 18）
node --version

# 安装依赖并初始化
npm run setup
# 或使用一键启动脚本
./scripts/dev.sh --setup-only
```

### 2. 启动开发服务器
```bash
# 方式一：使用脚本（推荐）
npm run start
# 或
./scripts/dev.sh

# 方式二：手动启动各服务
npm run dev  # 启动所有服务
```

### 3. 访问应用
- 🌐 **Web 应用**: http://localhost:5173
- 🔧 **API 服务**: http://localhost:3000
- 📱 **移动应用**: 使用 Expo Go 扫描二维码

### 4. 数据库管理
```bash
# 查看数据库
npx prisma studio

# 重置数据库
cd apps/api
npx prisma migrate reset

# 生成新的迁移
npx prisma migrate dev --name your-migration-name
```

---

## 🎨 自定义配置

### 项目信息
运行初始化向导自定义项目信息：
```bash
npm run template:init
```

### 数据库配置
编辑 `apps/api/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

### API 端点
在 `apps/api/src/` 中添加新的模块：
```bash
cd apps/api
npm run generate:module -- feature-name
```

### UI 主题
编辑样式文件：
- Web: `apps/web/src/App.css`
- Mobile: `packages/ui/src/card.tsx`

---

## 📦 添加新功能

### 1. 添加新的卡片类型
```typescript
// 1. 在 packages/shared-types/src/index.ts 中添加枚举
export enum CardType {
  // ... 现有类型
  YOUR_NEW_TYPE = 'YOUR_NEW_TYPE',
}

// 2. 添加配置接口
export interface CardConfig {
  // ... 现有配置
  yourNewType?: {
    property1: string;
    property2: number;
  };
}
```

### 2. 实现卡片渲染
```typescript
// packages/ui/src/card.tsx (React Native)
case CardType.YOUR_NEW_TYPE:
  return (
    <View>
      <Text>{card.config.yourNewType?.property1}</Text>
    </View>
  );

// apps/web/src/components/Card.tsx (React)
case CardType.YOUR_NEW_TYPE:
  return (
    <div>
      <p>{card.config.yourNewType?.property1}</p>
    </div>
  );
```

### 3. 添加 API 端点
```typescript
// apps/api/src/your-module/your-module.controller.ts
@Controller('your-endpoint')
export class YourController {
  @Get()
  async findAll() {
    return this.yourService.findAll();
  }
}
```

---

## 🔍 故障排除

### 常见问题

#### 1. 依赖安装失败
```bash
# 清理并重新安装
npm run clean
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. TypeScript 类型错误
```bash
# 构建共享包
cd packages/shared-types && npm run build
cd ../ui && npm run build

# 或使用根目录脚本
npm run build
```

#### 3. 数据库连接错误
```bash
# 重新生成 Prisma 客户端
cd apps/api
npx prisma generate
npx prisma migrate reset
```

#### 4. 移动应用无法启动
```bash
# 清理 Expo 缓存
cd apps/native
npx expo start --clear
```

### 获取帮助
- 📚 查看 [开发总结](DEVELOPMENT_SUMMARY.md)
- 💬 提交 [GitHub Issue](https://github.com/your-username/nestjs-monorepo-template/issues)
- 📖 阅读 [贡献指南](CONTRIBUTING.md)

---

## 🚀 部署指南

### Vercel 部署（Web）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署 Web 应用
cd apps/web
vercel --prod
```

### Railway 部署（API）
```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 部署 API
cd apps/api
railway login
railway deploy
```

### Expo 发布（Mobile）
```bash
# 发布到 Expo
cd apps/native
npx expo publish

# 构建独立应用
npx expo build:android
npx expo build:ios
```

---

## 📊 项目统计

### 技术栈
- **后端**: NestJS + Prisma + SQLite
- **前端**: React + Vite + CSS3
- **移动端**: React Native + Expo
- **构建工具**: Turborepo + tsup
- **代码质量**: ESLint + Prettier + TypeScript
- **CI/CD**: GitHub Actions

### 项目结构
```
📁 nestjs-monorepo/
├── 📁 apps/           # 应用程序
│   ├── 📁 api/        # NestJS 后端
│   ├── 📁 web/        # React 前端
│   └── 📁 native/     # React Native 应用
├── 📁 packages/       # 共享包
│   ├── 📁 shared-types/  # 类型定义
│   ├── 📁 ui/            # UI 组件
│   └── 📁 typescript-config/  # TS 配置
├── 📁 scripts/        # 开发脚本
├── 📁 .github/        # GitHub 配置
└── 📄 配置文件...
```

### 包大小
- **Web Bundle**: ~500KB (gzipped)
- **Mobile Bundle**: ~2MB
- **API**: ~50MB (with dependencies)

---

## 🎉 成功案例

### 适用场景
- ✅ 全栈 TypeScript 项目
- ✅ 多端应用开发
- ✅ 企业级后台管理
- ✅ 内容管理系统
- ✅ 数据可视化平台
- ✅ 社交媒体应用

### 定制案例
- 📊 **数据仪表板**: 扩展统计卡片类型
- 🛒 **电商平台**: 添加产品和订单管理
- 📝 **博客系统**: 实现文章和评论功能
- 🎮 **游戏管理**: 集成游戏数据和排行榜

---

## 💡 最佳实践

### 开发建议
1. **类型优先**: 先定义类型接口，再实现功能
2. **组件复用**: 保持组件接口一致，平台实现独立
3. **API 设计**: 遵循 RESTful 规范，统一响应格式
4. **错误处理**: 实现全局异常处理和用户友好提示
5. **性能优化**: 使用懒加载、缓存和代码分割

### 代码规范
- 使用 Conventional Commits 规范
- 保持函数单一职责
- 编写自文档化的代码
- 及时更新类型定义
- 定期重构和优化

---

## 🌟 贡献与反馈

我们欢迎你的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 反馈方式
- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/your-username/nestjs-monorepo-template/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/your-username/nestjs-monorepo-template/discussions)
- ⭐ **Star 支持**: [GitHub Repository](https://github.com/your-username/nestjs-monorepo-template)

---

**祝你开发愉快！🚀** 