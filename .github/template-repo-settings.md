# GitHub 模板仓库设置说明

## 📋 创建步骤

### 1. 创建仓库
1. 在 GitHub 上创建新仓库 `nestjs-monorepo-template`
2. 勾选 "Template repository" 选项
3. 添加适当的描述和标签

### 2. 仓库设置
```bash
# 克隆仓库并推送代码
git clone https://github.com/your-username/nestjs-monorepo-template.git
cd nestjs-monorepo-template

# 添加所有文件
git add .
git commit -m "Initial commit: NestJS Monorepo Template"
git push origin main
```

### 3. 设置仓库选项
在 GitHub 仓库设置页面：

#### General
- ✅ Template repository
- ✅ Issues
- ✅ Discussions
- ✅ Projects

#### Pages
- 设置 GitHub Pages（可选）
- Source: Deploy from a branch
- Branch: main / (root)

#### Security & Analysis
- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates

### 4. 添加主题标签
在仓库首页添加以下标签：
- `typescript`
- `nestjs`
- `react`
- `react-native`
- `monorepo`
- `template`
- `fullstack`
- `turborepo`
- `prisma`
- `cards`
- `configurable`

### 5. 发布到 NPM（可选）
```bash
# 登录 NPM
npm login

# 发布包
npm publish

# 或者发布为作用域包
npm publish --access public
```

## 🎯 使用方式

### 作为 GitHub 模板
1. 访问模板仓库页面
2. 点击 "Use this template" 按钮
3. 创建新仓库
4. 克隆新仓库到本地
5. 运行 `npm run template:init` 初始化

### 作为 NPM 模板
```bash
# 使用 npm
npm create nestjs-monorepo my-project

# 使用 yarn
yarn create nestjs-monorepo my-project

# 使用 pnpm
pnpm create nestjs-monorepo my-project
```

### 直接克隆
```bash
git clone https://github.com/your-username/nestjs-monorepo-template.git my-project
cd my-project
npm run template:init
```

## 📝 模板特性

### ✅ 包含功能
- 完整的 TypeScript 全栈架构
- NestJS 后端 API
- React Web 应用
- React Native 移动应用
- 共享类型定义和 UI 组件
- 可配置卡片系统
- Prisma 数据库集成
- CI/CD 工作流
- 完整的文档体系

### 🎨 可定制内容
- 项目名称和描述
- 作者信息
- Git 仓库地址
- 包命名空间
- 数据库配置
- API 端点
- UI 样式和主题

## 🔧 维护指南

### 定期更新
- 依赖包版本
- TypeScript 版本
- Node.js 版本要求
- 文档内容

### 版本发布
1. 更新 `CHANGELOG.md`
2. 更新版本号
3. 创建 GitHub Release
4. 发布到 NPM（如果适用）

### 问题处理
- 及时回复 Issues
- 审查 Pull Requests
- 更新文档和示例

## 🌟 推广建议

1. **社区分享**
   - 在 Reddit、Discord 等社区分享
   - 写博客文章介绍使用方法
   - 在 Twitter 等社交媒体宣传

2. **SEO 优化**
   - 完善 README 和文档
   - 添加合适的关键词
   - 提供使用示例和截图

3. **持续改进**
   - 收集用户反馈
   - 添加新功能
   - 优化开发体验 