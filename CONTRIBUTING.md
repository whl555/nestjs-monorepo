# 🤝 贡献指南

感谢您对 TypeScript 全栈卡片系统项目的关注！我们欢迎各种形式的贡献。

## 📋 贡献方式

### 🐛 报告问题
- 使用 GitHub Issues 报告 bug
- 提供详细的重现步骤
- 包含错误信息和环境信息

### 💡 功能建议
- 在 Issues 中提出新功能建议
- 详细描述功能需求和使用场景
- 如果可能，提供设计草图或原型

### 🔧 代码贡献
- Fork 项目到您的 GitHub 账户
- 创建功能分支
- 提交高质量的代码
- 创建 Pull Request

## 🛠️ 开发设置

### 环境要求
- Node.js >= 18
- npm >= 8
- Git

### 本地开发设置

```bash
# 1. Fork 并克隆项目
git clone https://github.com/your-username/nestjs-monorepo.git
cd nestjs-monorepo

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 构建共享包
npm run build

# 4. 设置数据库
cd apps/api
npx prisma migrate dev
npx tsx prisma/seed.ts

# 5. 启动开发服务器
npm run start:dev  # 后端
# 在新终端
cd ../web && npm run dev  # 前端
```

## 📝 编码规范

### TypeScript 规范
- 使用严格的 TypeScript 配置
- 为所有函数和变量提供类型注解
- 避免使用 `any` 类型

### 代码风格
- 使用 Prettier 格式化代码
- 遵循 ESLint 规则
- 使用有意义的变量和函数名

### 提交消息格式
使用约定式提交 (Conventional Commits)：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

示例：
```
feat(api): add card template system
fix(ui): resolve card rendering issue
docs: update API documentation
```

类型说明：
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具、依赖更新等

## 🧪 测试要求

### 单元测试
- 为新功能编写单元测试
- 确保测试覆盖率不低于现有水平
- 使用 Jest 作为测试框架

### 集成测试
- 为 API 端点编写集成测试
- 测试前后端交互
- 验证数据库操作

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行特定测试
cd apps/api && npm run test
cd apps/web && npm run test
```

## 📱 移动端开发

### 测试要求
- 在 iOS 和 Android 设备/模拟器上测试
- 确保跨平台兼容性
- 测试不同屏幕尺寸

### UI/UX 指南
- 遵循平台设计规范
- 保持一致的用户体验
- 优化触摸交互

## 🔍 代码审查流程

### Pull Request 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加必要的测试
- [ ] 文档已更新
- [ ] 无 TypeScript 错误
- [ ] 通过所有测试
- [ ] 提交消息符合规范

### 审查标准
- 功能正确性
- 代码质量和可维护性
- 性能影响
- 安全性考虑
- 用户体验

## 🎯 项目结构约定

### 文件组织
```
packages/shared-types/    # 共享类型定义
├── src/index.ts         # 导出所有类型
└── ...

packages/ui/             # 共享 UI 组件
├── src/
│   ├── index.tsx        # 导出所有组件
│   ├── card.tsx         # 卡片组件
│   └── card-grid.tsx    # 卡片网格组件
└── ...

apps/api/               # 后端 API
├── src/
│   ├── cards/          # 卡片功能模块
│   ├── auth/           # 认证模块
│   └── ...
└── prisma/             # 数据库相关

apps/web/               # Web 前端
├── src/
│   ├── components/     # React 组件
│   ├── services/       # API 服务
│   └── ...

apps/native/            # 移动端应用
├── app/
│   ├── services/       # API 服务
│   └── ...
```

### 命名约定
- 文件名：使用 kebab-case
- 组件名：使用 PascalCase
- 变量名：使用 camelCase
- 常量名：使用 UPPER_SNAKE_CASE

## 🐛 错误处理

### 后端错误处理
- 使用 NestJS 异常过滤器
- 提供有意义的错误消息
- 记录错误日志

### 前端错误处理
- 优雅降级
- 用户友好的错误提示
- 错误边界组件

## 📊 性能优化

### 前端性能
- 组件懒加载
- 图片优化
- 减少不必要的重渲染

### 后端性能
- 数据库查询优化
- 缓存策略
- API 响应优化

## 🔒 安全考虑

### 输入验证
- 使用 DTO 验证请求数据
- 防止 SQL 注入
- XSS 防护

### 认证授权
- JWT token 验证
- 用户权限检查
- 敏感数据保护

## 📖 文档要求

### 代码文档
- 为复杂函数添加 JSDoc 注释
- 更新 README 文件
- 维护 API 文档

### 示例代码
```typescript
/**
 * 创建新的卡片
 * @param data 卡片数据
 * @returns 创建的卡片对象
 * @throws {BadRequestException} 当数据验证失败时
 */
async createCard(data: CreateCardDto): Promise<Card> {
  // 实现逻辑...
}
```

## 🎉 发布流程

### 版本号规范
遵循语义化版本 (Semantic Versioning)：
- MAJOR.MINOR.PATCH
- 破坏性变更：主版本号
- 新功能：次版本号
- 错误修复：修订版本号

### 发布检查清单
- [ ] 所有测试通过
- [ ] 文档更新完成
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 创建 Git 标签

## ❓ 获取帮助

如果您在贡献过程中遇到问题：

1. 查看项目文档
2. 搜索现有的 Issues
3. 在 GitHub Discussions 中提问
4. 联系项目维护者

## 🏆 贡献者认可

我们重视每一位贡献者的努力：

- 贡献者将被添加到 README 的致谢列表
- 重大贡献将在发布说明中特别感谢
- 优秀贡献者有机会成为项目维护者

---

再次感谢您对项目的贡献！让我们共同构建更好的 TypeScript 全栈开发体验。 🚀 