# 🚀 快速使用指南

## 📋 故障排除新工具

基于刚刚修复的问题，我为项目添加了一套完整的检查和管理工具，让你能够快速诊断和解决问题。

---

## 🛠️ 可用的检查脚本

### 1. 系统健康检查
```bash
# 使用脚本
./scripts/health-check.sh

# 或使用 npm 命令
npm run health
```

**功能**：
- ✅ Node.js 版本检查
- ✅ 端口占用检查 (3000, 5173, 5174)
- ✅ 依赖安装状态
- ✅ 数据库文件检查
- ✅ 正在运行的服务检查
- ✅ 网络连接测试

### 2. 服务管理
```bash
# 使用脚本
./scripts/service-manager.sh [命令]

# 或使用 npm 命令
npm run service [命令]
```

**可用命令**：
- `start` - 启动所有服务
- `stop` - 停止所有服务
- `restart` - 重启所有服务
- `status` - 显示服务状态
- `logs` - 显示服务日志
- `clean` - 清理进程和端口
- `test` - 测试API连接

### 3. 依赖检查
```bash
# 使用脚本
./scripts/dependency-check.sh

# 或使用 npm 命令
npm run deps
```

**功能**：
- ✅ 开发环境检查
- ✅ 各包依赖完整性
- ✅ 关键依赖验证
- ✅ 构建输出检查
- ✅ TypeScript 配置检查
- ✅ Git 状态检查
- 📊 生成详细报告

---

## 🔧 常用命令组合

### 快速问题诊断
```bash
# 综合检查（健康检查 + 依赖检查）
npm run check

# 完整故障排除流程
npm run troubleshoot
```

### 服务管理常用操作
```bash
# 查看服务状态
npm run service status

# 清理所有进程（解决端口占用）
npm run service clean

# 启动所有服务
npm run service start

# 查看服务日志
npm run service logs

# 测试 API 连通性
npm run service test
```

### 依赖问题修复
```bash
# 检查依赖状态
npm run deps

# 完整环境设置
npm run setup

# 清理并重新安装（最彻底的修复）
./scripts/dev.sh --clean
```

---

## 🆘 故障排除流程

当项目出现问题时，按照以下步骤操作：

### 步骤 1: 系统健康检查
```bash
npm run health
```
这会告诉你：
- Node.js 版本是否正确
- 端口是否被占用
- 依赖是否正确安装
- 数据库是否正常
- 服务是否正在运行

### 步骤 2: 清理环境（如果有端口冲突）
```bash
npm run service clean
```

### 步骤 3: 检查依赖
```bash
npm run deps
```
这会检查：
- 所有包的依赖完整性
- 关键包是否存在
- TypeScript 配置
- 构建输出状态

### 步骤 4: 修复问题
根据检查结果选择适当的修复方案：

```bash
# 轻量修复：重新安装依赖
npm run setup

# 中度修复：重建包
cd packages/shared-types && npm run build
cd packages/ui && npm run build

# 重度修复：完全重置
./scripts/dev.sh --clean
```

### 步骤 5: 启动服务
```bash
npm run service start
```

### 步骤 6: 验证修复
```bash
npm run service test
npm run service status
```

---

## 📊 实际使用示例

### 示例 1: 解决端口占用问题
```bash
$ npm run health
# 输出显示端口 3000 被占用

$ npm run service clean
# 清理所有相关进程

$ npm run service start
# 重新启动服务
```

### 示例 2: 解决依赖问题
```bash
$ npm run deps
# 输出显示某些包依赖缺失

$ npm run setup
# 重新安装和构建依赖

$ npm run health
# 验证修复结果
```

### 示例 3: 日常开发检查
```bash
$ npm run check
# 运行健康检查和依赖检查

$ npm run service status
# 查看当前服务状态

$ npm run service test
# 测试 API 是否正常工作
```

---

## 🎯 脚本特色功能

### 智能端口管理
- 自动检测端口占用
- 智能清理冲突进程
- 支持备用端口（5174）

### 彩色输出
- ✅ 绿色表示正常
- ⚠️ 黄色表示警告
- ❌ 红色表示错误
- 🔵 蓝色表示信息

### 详细诊断
- 显示进程信息
- 提供修复建议
- 生成详细报告

### 后台服务管理
- PID 文件管理
- 日志文件记录
- 优雅的启停控制

---

## 💡 最佳实践

### 开发前检查
```bash
# 每次开始开发前运行
npm run check
```

### 遇到问题时
```bash
# 第一时间运行故障排除
npm run troubleshoot
```

### 服务管理
```bash
# 使用服务管理器而不是手动启停
npm run service start    # 而不是直接运行 npm run dev
npm run service stop     # 而不是 Ctrl+C
```

### 定期维护
```bash
# 每周运行一次依赖检查
npm run deps

# 定期清理环境
npm run service clean
```

---

## 📚 相关文档

- 📋 [完整故障排除指南](TROUBLESHOOTING.md) - 详细的问题分析和解决方案
- 🛠️ [开发总结](DEVELOPMENT_SUMMARY.md) - 技术实现细节
- 📖 [使用指南](TEMPLATE_USAGE.md) - 模板使用说明
- 🤝 [贡献指南](CONTRIBUTING.md) - 参与开发规范

---

**🎉 现在你拥有了一套完整的项目管理工具！遇到问题时不再慌张，几个命令就能快速定位和解决问题。** 