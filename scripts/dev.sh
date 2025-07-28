#!/bin/bash

# TypeScript 全栈卡片系统 - 开发环境启动脚本

set -e

echo "🎯 TypeScript 全栈卡片系统"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
check_node_version() {
    echo -e "${BLUE}检查 Node.js 版本...${NC}"
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ 需要 Node.js 18 或更高版本，当前版本: $(node -v)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js 版本检查通过: $(node -v)${NC}"
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}安装项目依赖...${NC}"
    if [ ! -d "node_modules" ]; then
        npm install --legacy-peer-deps
    else
        echo -e "${GREEN}✅ 依赖已安装${NC}"
    fi
}

# 构建共享包
build_packages() {
    echo -e "${BLUE}构建共享包...${NC}"
    
    # 构建 shared-types
    if [ ! -d "packages/shared-types/dist" ]; then
        echo -e "${YELLOW}构建 @repo/shared-types...${NC}"
        cd packages/shared-types
        npx tsup
        cd ../..
    fi
    
    # 构建 ui
    if [ ! -d "packages/ui/dist" ]; then
        echo -e "${YELLOW}构建 @repo/ui...${NC}"
        cd packages/ui
        npx tsup
        cd ../..
    fi
    
    echo -e "${GREEN}✅ 共享包构建完成${NC}"
}

# 设置数据库
setup_database() {
    echo -e "${BLUE}设置数据库...${NC}"
    cd apps/api
    
    if [ ! -f "prisma/dev.db" ]; then
        echo -e "${YELLOW}初始化数据库...${NC}"
        npx prisma migrate dev --name "init"
        npx tsx prisma/seed.ts
    else
        echo -e "${GREEN}✅ 数据库已存在${NC}"
    fi
    
    cd ../..
}

# 启动开发服务器
start_dev_servers() {
    echo -e "${BLUE}启动开发服务器...${NC}"
    
    # 检查端口占用
    check_port() {
        if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${YELLOW}⚠️  端口 $1 已被占用${NC}"
            return 1
        fi
        return 0
    }
    
    # 启动后端
    echo -e "${YELLOW}启动后端 API (端口 3000)...${NC}"
    if check_port 3000; then
        cd apps/api
        npm run start:dev &
        API_PID=$!
        cd ../..
        echo -e "${GREEN}✅ 后端 API 启动成功 (PID: $API_PID)${NC}"
    fi
    
    # 等待后端启动
    echo -e "${YELLOW}等待后端启动...${NC}"
    sleep 5
    
    # 启动 Web 前端
    echo -e "${YELLOW}启动 Web 前端 (端口 5173)...${NC}"
    if check_port 5173; then
        cd apps/web
        npm run dev &
        WEB_PID=$!
        cd ../..
        echo -e "${GREEN}✅ Web 前端启动成功 (PID: $WEB_PID)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🚀 所有服务启动完成！${NC}"
    echo ""
    echo -e "${BLUE}访问地址：${NC}"
    echo -e "  🌐 Web 应用:    http://localhost:5173"
    echo -e "  🔧 API 服务:    http://localhost:3000"
    echo ""
    echo -e "${BLUE}移动端应用：${NC}"
    echo -e "  📱 启动命令:    cd apps/native && npm run dev"
    echo ""
    echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
    
    # 等待用户中断
    trap 'echo -e "\n${YELLOW}正在停止服务...${NC}"; kill $API_PID $WEB_PID 2>/dev/null; exit 0' INT
    wait
}

# 主函数
main() {
    echo -e "${BLUE}开始启动开发环境...${NC}"
    echo ""
    
    check_node_version
    install_dependencies
    build_packages
    setup_database
    start_dev_servers
}

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  --setup-only   仅设置环境，不启动服务"
    echo "  --clean        清理并重新安装"
    echo ""
    echo "示例:"
    echo "  $0              # 启动开发环境"
    echo "  $0 --setup-only # 仅设置环境"
    echo "  $0 --clean      # 清理并重新安装"
}

# 清理环境
clean_environment() {
    echo -e "${YELLOW}清理开发环境...${NC}"
    
    # 清理 node_modules
    echo -e "${YELLOW}清理 node_modules...${NC}"
    rm -rf node_modules
    rm -rf apps/*/node_modules
    rm -rf packages/*/node_modules
    
    # 清理构建文件
    echo -e "${YELLOW}清理构建文件...${NC}"
    rm -rf packages/*/dist
    rm -rf apps/*/dist
    
    # 清理数据库
    echo -e "${YELLOW}清理数据库...${NC}"
    rm -f apps/api/prisma/dev.db*
    
    echo -e "${GREEN}✅ 环境清理完成${NC}"
}

# 解析命令行参数
case "$1" in
    -h|--help)
        show_help
        ;;
    --setup-only)
        check_node_version
        install_dependencies
        build_packages
        setup_database
        echo -e "${GREEN}✅ 环境设置完成${NC}"
        ;;
    --clean)
        clean_environment
        main
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ 未知选项: $1${NC}"
        show_help
        exit 1
        ;;
esac 