# 🔧 项目故障排除指南

## 📋 修复过程记录

### 问题概述
在项目启动过程中遇到了多个技术问题，包括TypeScript类型错误、依赖管理问题、端口占用等。本文档详细记录了问题分析和解决过程。

---

## 🐛 问题一：TypeScript 类型定义错误

### 问题现象
```bash
Cannot find type definition file for 'babel__core'.
Cannot find type definition file for 'babel__generator'.
Cannot find type definition file for 'babel__template'.
...
```

### 根本原因
`packages/ui` 包的 TypeScript 编译器尝试查找各种依赖包的类型定义，但这些 `@types/*` 包未安装。

### 解决步骤

#### 1. 添加缺失的类型定义包
```bash
cd packages/ui
```

修改 `package.json`，添加以下依赖：
```json
{
  "devDependencies": {
    "@types/babel__core": "^7.20.0",
    "@types/babel__generator": "^7.6.0",
    "@types/babel__template": "^7.4.0",
    "@types/babel__traverse": "^7.18.0",
    "@types/connect": "^3.4.0",
    "@types/express": "^4.17.0",
    "@types/express-serve-static-core": "^4.17.0",
    "@types/graceful-fs": "^4.1.0",
    "@types/json-schema": "^7.0.0",
    "@types/prop-types": "^15.7.0",
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "@types/send": "^0.17.0",
    "@types/serve-static": "^1.15.0",
    "@types/stack-utils": "^2.0.0",
    "@types/supertest": "^2.0.0"
  }
}
```

#### 2. 简化 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "./dist",
    "jsx": "react-native",
    "noEmit": false,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "build", "node_modules"]
}
```

#### 3. 重新安装依赖
```bash
npm install --legacy-peer-deps
```

### 经验总结
- React Native 项目通常需要大量的 `@types/*` 包
- 使用 `skipLibCheck: true` 可以跳过类型检查，提高编译速度
- `--legacy-peer-deps` 标志有助于解决依赖冲突

---

## 🐛 问题二：API 服务 TypeScript 类型错误

### 问题现象
```bash
Type 'string | null' is not assignable to type 'string | undefined'.
Type 'null' is not assignable to type 'string | undefined'.
```

### 根本原因
Prisma 数据库返回的 `template.description` 类型为 `string | null`，但 DTO 定义期望 `string | undefined`。

### 解决步骤

#### 1. 修复类型转换
```typescript
// apps/api/src/cards/cards.service.ts
return await this.createCard({
  title: template.name,
  description: template.description || undefined, // 修复：将 null 转换为 undefined
  type: template.type,
  config,
});
```

### 经验总结
- Prisma 返回 `null`，TypeScript DTO 通常使用 `undefined`
- 使用 `|| undefined` 进行类型转换是常见解决方案
- 保持数据库层和业务逻辑层的类型一致性很重要

---

## 🐛 问题三：依赖管理和构建问题

### 问题现象
- 各种模块找不到错误
- 构建失败
- 类型定义缺失

### 解决步骤

#### 1. 清理所有依赖
```bash
# 清理根目录
rm -rf node_modules package-lock.json

# 清理所有子包
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
find . -name "package-lock.json" -delete 2>/dev/null
```

#### 2. 按顺序重新安装和构建
```bash
# 1. 安装根目录依赖
npm install --legacy-peer-deps

# 2. 构建共享类型包
cd packages/shared-types
npm install --legacy-peer-deps
npm run build

# 3. 构建 UI 包
cd ../ui
npm install --legacy-peer-deps
npm run build

# 4. 安装各应用依赖
cd ../../apps/api && npm install --legacy-peer-deps
cd ../web && npm install --legacy-peer-deps
cd ../native && npm install --legacy-peer-deps
```

#### 3. 数据库设置
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 经验总结
- Monorepo 中的构建顺序很重要：shared-types → ui → apps
- `--legacy-peer-deps` 可以解决大多数依赖冲突问题
- 数据库迁移需要在 API 启动前完成

---

## 🐛 问题四：端口占用问题

### 问题现象
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

### 根本原因
多个 NestJS 实例尝试监听同一端口 3000。

### 解决步骤

#### 1. 检查端口占用
```bash
lsof -i :3000
lsof -i :5173
```

#### 2. 终止冲突进程
```bash
# 终止特定进程
pkill -f "nest start"
pkill -f vite

# 或使用 PID
kill -9 <PID>
```

#### 3. 确保单实例运行
```bash
# 启动前检查
ps aux | grep -E "(nest|vite)" | grep -v grep
```

### 经验总结
- 开发环境中经常出现端口占用问题
- 使用脚本自动检查和清理进程更高效
- 多终端开发时容易忘记正在运行的服务

---

## 🛠️ 自动化检查脚本

### 1. 系统健康检查脚本

```bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 系统健康检查"
echo "====================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 Node.js 版本
check_node() {
    echo -n "检查 Node.js 版本... "
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$NODE_MAJOR" -ge 18 ]; then
            echo -e "${GREEN}✓ $NODE_VERSION${NC}"
        else
            echo -e "${RED}✗ 需要 Node.js 18+，当前: $NODE_VERSION${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ 未安装${NC}"
        return 1
    fi
}

# 检查端口占用
check_ports() {
    echo "检查端口占用..."
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 3000 被占用${NC}"
        echo "占用进程:"
        lsof -i :3000
    else
        echo -e "${GREEN}✓ 端口 3000 可用${NC}"
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 5173 被占用${NC}"
        echo "占用进程:"
        lsof -i :5173
    else
        echo -e "${GREEN}✓ 端口 5173 可用${NC}"
    fi
}

# 检查依赖安装状态
check_dependencies() {
    echo "检查依赖安装状态..."
    
    # 检查根目录
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓ 根目录依赖已安装${NC}"
    else
        echo -e "${RED}✗ 根目录依赖未安装${NC}"
    fi
    
    # 检查包构建状态
    if [ -d "packages/shared-types/dist" ]; then
        echo -e "${GREEN}✓ shared-types 已构建${NC}"
    else
        echo -e "${RED}✗ shared-types 未构建${NC}"
    fi
    
    if [ -d "packages/ui/dist" ]; then
        echo -e "${GREEN}✓ ui 包已构建${NC}"
    else
        echo -e "${RED}✗ ui 包未构建${NC}"
    fi
}

# 检查数据库状态
check_database() {
    echo "检查数据库状态..."
    
    if [ -f "apps/api/prisma/dev.db" ]; then
        echo -e "${GREEN}✓ 数据库文件存在${NC}"
    else
        echo -e "${RED}✗ 数据库文件不存在${NC}"
    fi
}

# 检查正在运行的服务
check_running_services() {
    echo "检查正在运行的服务..."
    
    if ps aux | grep -q "[n]est start"; then
        echo -e "${GREEN}✓ NestJS API 服务正在运行${NC}"
        echo "进程信息:"
        ps aux | grep "[n]est start"
    else
        echo -e "${YELLOW}⚠️  NestJS API 服务未运行${NC}"
    fi
    
    if ps aux | grep -q "[v]ite"; then
        echo -e "${GREEN}✓ Vite Web 服务正在运行${NC}"
        echo "进程信息:"
        ps aux | grep "[v]ite"
    else
        echo -e "${YELLOW}⚠️  Vite Web 服务未运行${NC}"
    fi
}

# 执行所有检查
check_node
check_ports
check_dependencies
check_database
check_running_services

echo ""
echo "🏁 健康检查完成"
```

### 2. 服务管理脚本

```bash
#!/bin/bash
# scripts/service-manager.sh

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo "服务管理脚本"
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start     启动所有服务"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    显示服务状态"
    echo "  logs      显示服务日志"
    echo "  clean     清理进程和端口"
}

start_services() {
    echo -e "${BLUE}🚀 启动服务...${NC}"
    
    # 检查端口
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 3000 已被占用，正在清理...${NC}"
        pkill -f "nest start" 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 5173 已被占用，正在清理...${NC}"
        pkill -f vite 2>/dev/null || true
        sleep 2
    fi
    
    # 启动 API
    echo -e "${BLUE}启动 API 服务...${NC}"
    cd apps/api
    npm run start:dev > ../../logs/api.log 2>&1 &
    API_PID=$!
    cd ../..
    
    # 等待 API 启动
    sleep 5
    
    # 启动 Web
    echo -e "${BLUE}启动 Web 服务...${NC}"
    cd apps/web
    npm run dev > ../../logs/web.log 2>&1 &
    WEB_PID=$!
    cd ../..
    
    # 保存 PID
    echo $API_PID > .pids/api.pid
    echo $WEB_PID > .pids/web.pid
    
    echo -e "${GREEN}✅ 服务启动完成${NC}"
    echo "API PID: $API_PID"
    echo "Web PID: $WEB_PID"
}

stop_services() {
    echo -e "${BLUE}🛑 停止服务...${NC}"
    
    # 停止所有相关进程
    pkill -f "nest start" 2>/dev/null || true
    pkill -f vite 2>/dev/null || true
    
    # 清理 PID 文件
    rm -f .pids/*.pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ 服务已停止${NC}"
}

show_status() {
    echo -e "${BLUE}📊 服务状态${NC}"
    echo "====================="
    
    # API 服务状态
    if ps aux | grep -q "[n]est start"; then
        echo -e "API 服务: ${GREEN}运行中${NC}"
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "端口 3000: ${GREEN}监听中${NC}"
        else
            echo -e "端口 3000: ${RED}未监听${NC}"
        fi
    else
        echo -e "API 服务: ${RED}未运行${NC}"
    fi
    
    # Web 服务状态
    if ps aux | grep -q "[v]ite"; then
        echo -e "Web 服务: ${GREEN}运行中${NC}"
        if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "端口 5173: ${GREEN}监听中${NC}"
        elif lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "端口 5174: ${GREEN}监听中${NC} (备用端口)"
        else
            echo -e "端口 5173: ${RED}未监听${NC}"
        fi
    else
        echo -e "Web 服务: ${RED}未运行${NC}"
    fi
}

show_logs() {
    echo -e "${BLUE}📋 服务日志${NC}"
    echo "====================="
    
    if [ -f "logs/api.log" ]; then
        echo -e "${YELLOW}API 日志 (最近 20 行):${NC}"
        tail -20 logs/api.log
        echo ""
    fi
    
    if [ -f "logs/web.log" ]; then
        echo -e "${YELLOW}Web 日志 (最近 20 行):${NC}"
        tail -20 logs/web.log
    fi
}

clean_processes() {
    echo -e "${BLUE}🧹 清理进程和端口...${NC}"
    
    # 强制停止所有相关进程
    pkill -9 -f "nest start" 2>/dev/null || true
    pkill -9 -f vite 2>/dev/null || true
    pkill -9 -f "node.*3000" 2>/dev/null || true
    pkill -9 -f "node.*5173" 2>/dev/null || true
    
    # 等待进程完全停止
    sleep 3
    
    # 检查端口是否释放
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠️  端口 3000 仍被占用${NC}"
        lsof -i :3000
    else
        echo -e "${GREEN}✅ 端口 3000 已释放${NC}"
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠️  端口 5173 仍被占用${NC}"
        lsof -i :5173
    else
        echo -e "${GREEN}✅ 端口 5173 已释放${NC}"
    fi
    
    # 清理日志和 PID 文件
    rm -f logs/*.log .pids/*.pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ 清理完成${NC}"
}

# 创建必要的目录
mkdir -p logs .pids

# 解析命令
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 3
        start_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_processes
        ;;
    ""|help|-h|--help)
        show_help
        ;;
    *)
        echo -e "${RED}未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac
```

### 3. 依赖检查脚本

```bash
#!/bin/bash
# scripts/dependency-check.sh

echo "🔍 依赖完整性检查"
echo "====================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_package_deps() {
    local package_path=$1
    local package_name=$2
    
    echo "检查 $package_name..."
    
    if [ ! -d "$package_path/node_modules" ]; then
        echo -e "${RED}✗ $package_name 依赖未安装${NC}"
        return 1
    fi
    
    cd "$package_path"
    
    # 检查是否有缺失的依赖
    if npm ls --depth=0 2>/dev/null | grep -q "UNMET DEPENDENCY\|missing:"; then
        echo -e "${YELLOW}⚠️  $package_name 有缺失的依赖${NC}"
        npm ls --depth=0 2>&1 | grep -E "(UNMET DEPENDENCY|missing:)"
    else
        echo -e "${GREEN}✓ $package_name 依赖完整${NC}"
    fi
    
    cd - >/dev/null
}

# 检查各包的依赖
check_package_deps "." "根目录"
check_package_deps "packages/shared-types" "shared-types"
check_package_deps "packages/ui" "ui"
check_package_deps "apps/api" "api"
check_package_deps "apps/web" "web"
check_package_deps "apps/native" "native"

echo ""
echo "🏁 依赖检查完成"
```

---

## 📝 使用说明

### 脚本安装
```bash
# 创建脚本并设置权限
chmod +x scripts/health-check.sh
chmod +x scripts/service-manager.sh
chmod +x scripts/dependency-check.sh
```

### 常用命令
```bash
# 健康检查
./scripts/health-check.sh

# 服务管理
./scripts/service-manager.sh status   # 查看状态
./scripts/service-manager.sh start    # 启动服务
./scripts/service-manager.sh stop     # 停止服务
./scripts/service-manager.sh clean    # 清理进程

# 依赖检查
./scripts/dependency-check.sh
```

### 故障排除流程
1. **运行健康检查**: `./scripts/health-check.sh`
2. **清理环境**: `./scripts/service-manager.sh clean`
3. **检查依赖**: `./scripts/dependency-check.sh`
4. **重新启动**: `./scripts/service-manager.sh start`

---

## 🎯 最佳实践

### 开发环境维护
1. **定期清理**: 每周运行一次 `clean` 命令
2. **依赖更新**: 定期检查和更新依赖包
3. **日志监控**: 使用 `logs` 命令查看服务状态
4. **端口管理**: 避免多个实例同时运行

### 问题预防
1. **统一 Node.js 版本**: 使用 `.nvmrc` 文件
2. **锁定依赖版本**: 使用 `package-lock.json`
3. **环境隔离**: 使用 Docker 容器开发
4. **自动化测试**: 集成 CI/CD 流程

---

## 📚 相关文档
- [开发总结](DEVELOPMENT_SUMMARY.md)
- [使用指南](TEMPLATE_USAGE.md)
- [贡献指南](CONTRIBUTING.md) 