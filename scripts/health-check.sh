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
    
    if lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 5174 被占用${NC}"
        echo "占用进程:"
        lsof -i :5174
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
    
    # 检查各应用依赖
    for app in api web native; do
        if [ -d "apps/$app/node_modules" ]; then
            echo -e "${GREEN}✓ $app 应用依赖已安装${NC}"
        else
            echo -e "${RED}✗ $app 应用依赖未安装${NC}"
        fi
    done
}

# 检查数据库状态
check_database() {
    echo "检查数据库状态..."
    
    if [ -f "apps/api/prisma/dev.db" ]; then
        echo -e "${GREEN}✓ 数据库文件存在${NC}"
        # 检查数据库大小
        DB_SIZE=$(ls -lh apps/api/prisma/dev.db | awk '{print $5}')
        echo "  数据库大小: $DB_SIZE"
    else
        echo -e "${RED}✗ 数据库文件不存在${NC}"
        echo "  运行: cd apps/api && npx prisma migrate dev"
    fi
    
    # 检查 Prisma Client
    if [ -d "node_modules/@prisma/client" ]; then
        echo -e "${GREEN}✓ Prisma Client 已生成${NC}"
    else
        echo -e "${RED}✗ Prisma Client 未生成${NC}"
        echo "  运行: cd apps/api && npx prisma generate"
    fi
}

# 检查正在运行的服务
check_running_services() {
    echo "检查正在运行的服务..."
    
    if ps aux | grep -q "[n]est start"; then
        echo -e "${GREEN}✓ NestJS API 服务正在运行${NC}"
        echo "进程信息:"
        ps aux | grep "[n]est start" | head -3
    else
        echo -e "${YELLOW}⚠️  NestJS API 服务未运行${NC}"
    fi
    
    if ps aux | grep -q "[v]ite"; then
        echo -e "${GREEN}✓ Vite Web 服务正在运行${NC}"
        echo "进程信息:"
        ps aux | grep "[v]ite" | head -3
    else
        echo -e "${YELLOW}⚠️  Vite Web 服务未运行${NC}"
    fi
}

# 检查网络连接
check_network() {
    echo "检查网络连接..."
    
    # 测试 API 连接
    if curl -s --max-time 3 http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ API 服务响应正常${NC}"
    else
        echo -e "${RED}✗ API 服务无响应${NC}"
    fi
    
    # 测试 Web 连接
    if curl -s --max-time 3 http://localhost:5173 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Web 服务响应正常${NC}"
    elif curl -s --max-time 3 http://localhost:5174 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Web 服务响应正常 (端口 5174)${NC}"
    else
        echo -e "${RED}✗ Web 服务无响应${NC}"
    fi
}

# 执行所有检查
echo "开始健康检查..."
echo ""

check_node
echo ""
check_ports
echo ""
check_dependencies
echo ""
check_database
echo ""
check_running_services
echo ""
check_network

echo ""
echo "🏁 健康检查完成"

# 如果有错误，给出建议
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 修复建议:${NC}"
    echo "1. 运行完整设置: ./scripts/dev.sh --setup-only"
    echo "2. 清理环境: ./scripts/service-manager.sh clean"
    echo "3. 重新启动: ./scripts/service-manager.sh start"
fi 