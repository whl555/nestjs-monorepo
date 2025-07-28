#!/bin/bash
# scripts/service-manager.sh

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo "🛠️  服务管理脚本"
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start     启动所有服务"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    显示服务状态"
    echo "  logs      显示服务日志"
    echo "  clean     清理进程和端口"
    echo "  test      测试API连接"
    echo ""
    echo "示例:"
    echo "  $0 start    # 启动所有服务"
    echo "  $0 status   # 查看服务状态"
    echo "  $0 clean    # 清理所有进程"
}

start_services() {
    echo -e "${BLUE}🚀 启动服务...${NC}"
    
    # 创建日志目录
    mkdir -p logs .pids
    
    # 检查并清理端口冲突
    check_and_clean_ports
    
    # 启动 API
    echo -e "${BLUE}启动 API 服务 (端口 3000)...${NC}"
    cd apps/api
    nohup npm run start:dev > ../../logs/api.log 2>&1 &
    API_PID=$!
    echo $API_PID > ../../.pids/api.pid
    cd ../..
    
    # 等待 API 启动
    echo "等待 API 启动..."
    for i in {1..15}; do
        if curl -s --max-time 2 http://localhost:3000 >/dev/null 2>&1; then
            echo -e "${GREEN}✅ API 服务启动成功 (PID: $API_PID)${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # 启动 Web
    echo -e "${BLUE}启动 Web 服务 (端口 5173)...${NC}"
    cd apps/web
    nohup npm run dev > ../../logs/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > ../../.pids/web.pid
    cd ../..
    
    # 等待 Web 启动
    echo "等待 Web 启动..."
    for i in {1..10}; do
        if curl -s --max-time 2 http://localhost:5173 >/dev/null 2>&1 || curl -s --max-time 2 http://localhost:5174 >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Web 服务启动成功 (PID: $WEB_PID)${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    echo ""
    echo -e "${GREEN}🎉 所有服务启动完成！${NC}"
    echo ""
    echo "访问地址："
    echo "  🌐 Web 应用:    http://localhost:5173"
    echo "  🔧 API 服务:    http://localhost:3000"
    echo "  📊 API 状态:    http://localhost:3000/health"
    echo "  🗂️  API 卡片:    http://localhost:3000/cards"
    echo ""
    echo "移动端应用："
    echo "  📱 启动命令:    cd apps/native && npm run dev"
    echo ""
    echo "按 Ctrl+C 或运行 '$0 stop' 停止所有服务"
}

stop_services() {
    echo -e "${BLUE}🛑 停止服务...${NC}"
    
    # 读取 PID 文件并停止进程
    if [ -f ".pids/api.pid" ]; then
        API_PID=$(cat .pids/api.pid)
        if kill -0 $API_PID 2>/dev/null; then
            kill $API_PID
            echo -e "${GREEN}✅ API 服务已停止 (PID: $API_PID)${NC}"
        fi
        rm -f .pids/api.pid
    fi
    
    if [ -f ".pids/web.pid" ]; then
        WEB_PID=$(cat .pids/web.pid)
        if kill -0 $WEB_PID 2>/dev/null; then
            kill $WEB_PID
            echo -e "${GREEN}✅ Web 服务已停止 (PID: $WEB_PID)${NC}"
        fi
        rm -f .pids/web.pid
    fi
    
    # 备用停止方法：通过进程名
    pkill -f "nest start" 2>/dev/null && echo "停止了额外的 NestJS 进程"
    pkill -f "vite" 2>/dev/null && echo "停止了额外的 Vite 进程"
    
    echo -e "${GREEN}✅ 所有服务已停止${NC}"
}

show_status() {
    echo -e "${BLUE}📊 服务状态检查${NC}"
    echo "====================="
    
    # API 服务状态
    echo -n "API 服务状态: "
    if ps aux | grep -q "[n]est start"; then
        echo -e "${GREEN}运行中${NC}"
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  端口 3000: ${GREEN}✓ 监听中${NC}"
            # 测试 API 响应
            if curl -s --max-time 3 http://localhost:3000 >/dev/null 2>&1; then
                echo -e "  连接测试: ${GREEN}✓ 响应正常${NC}"
            else
                echo -e "  连接测试: ${RED}✗ 无响应${NC}"
            fi
        else
            echo -e "  端口 3000: ${RED}✗ 未监听${NC}"
        fi
        # 显示进程信息
        echo "  进程信息:"
        ps aux | grep "[n]est start" | head -2 | while read line; do
            echo "    $line"
        done
    else
        echo -e "${RED}未运行${NC}"
    fi
    
    echo ""
    
    # Web 服务状态
    echo -n "Web 服务状态: "
    if ps aux | grep -q "[v]ite"; then
        echo -e "${GREEN}运行中${NC}"
        if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  端口 5173: ${GREEN}✓ 监听中${NC}"
            WEB_URL="http://localhost:5173"
        elif lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  端口 5174: ${GREEN}✓ 监听中${NC} (备用端口)"
            WEB_URL="http://localhost:5174"
        else
            echo -e "  端口 5173/5174: ${RED}✗ 未监听${NC}"
            WEB_URL=""
        fi
        
        # 测试 Web 响应
        if [ -n "$WEB_URL" ] && curl -s --max-time 3 "$WEB_URL" >/dev/null 2>&1; then
            echo -e "  连接测试: ${GREEN}✓ 响应正常${NC}"
        elif [ -n "$WEB_URL" ]; then
            echo -e "  连接测试: ${RED}✗ 无响应${NC}"
        fi
        
        # 显示进程信息
        echo "  进程信息:"
        ps aux | grep "[v]ite" | head -2 | while read line; do
            echo "    $line"
        done
    else
        echo -e "${RED}未运行${NC}"
    fi
    
    echo ""
    
    # 数据库状态
    echo -n "数据库状态: "
    if [ -f "apps/api/prisma/dev.db" ]; then
        DB_SIZE=$(ls -lh apps/api/prisma/dev.db | awk '{print $5}')
        echo -e "${GREEN}✓ 存在${NC} (大小: $DB_SIZE)"
    else
        echo -e "${RED}✗ 不存在${NC}"
    fi
    
    echo ""
    echo "📝 使用 '$0 logs' 查看详细日志"
    echo "🧹 使用 '$0 clean' 清理所有进程"
}

show_logs() {
    echo -e "${BLUE}📋 服务日志${NC}"
    echo "====================="
    
    if [ -f "logs/api.log" ]; then
        echo -e "${YELLOW}📄 API 日志 (最近 15 行):${NC}"
        echo "---"
        tail -15 logs/api.log
        echo ""
    else
        echo -e "${RED}✗ API 日志文件不存在${NC}"
        echo ""
    fi
    
    if [ -f "logs/web.log" ]; then
        echo -e "${YELLOW}📄 Web 日志 (最近 15 行):${NC}"
        echo "---"
        tail -15 logs/web.log
        echo ""
    else
        echo -e "${RED}✗ Web 日志文件不存在${NC}"
        echo ""
    fi
    
    echo "💡 使用 'tail -f logs/api.log' 或 'tail -f logs/web.log' 实时查看日志"
}

check_and_clean_ports() {
    echo "检查端口占用..."
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 3000 已被占用，正在清理...${NC}"
        pkill -f "nest start" 2>/dev/null || true
        # 等待进程完全停止
        sleep 3
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}⚠️  端口 3000 仍被占用，尝试强制清理...${NC}"
            lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        fi
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 5173 已被占用，正在清理...${NC}"
        pkill -f vite 2>/dev/null || true
        sleep 2
    fi
}

clean_processes() {
    echo -e "${BLUE}🧹 清理进程和端口...${NC}"
    
    # 强制停止所有相关进程
    echo "停止 NestJS 进程..."
    pkill -9 -f "nest start" 2>/dev/null || true
    
    echo "停止 Vite 进程..."
    pkill -9 -f vite 2>/dev/null || true
    
    echo "停止可能的 Node 进程..."
    pkill -9 -f "node.*3000" 2>/dev/null || true
    pkill -9 -f "node.*5173" 2>/dev/null || true
    pkill -9 -f "node.*5174" 2>/dev/null || true
    
    # 等待进程完全停止
    echo "等待进程完全停止..."
    sleep 3
    
    # 检查端口是否释放
    echo "检查端口释放状态..."
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠️  端口 3000 仍被占用${NC}"
        echo "占用进程:"
        lsof -i :3000
    else
        echo -e "${GREEN}✅ 端口 3000 已释放${NC}"
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠️  端口 5173 仍被占用${NC}"
        echo "占用进程:"
        lsof -i :5173
    else
        echo -e "${GREEN}✅ 端口 5173 已释放${NC}"
    fi
    
    if lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠️  端口 5174 仍被占用${NC}"
        echo "占用进程:"
        lsof -i :5174
    else
        echo -e "${GREEN}✅ 端口 5174 已释放${NC}"
    fi
    
    # 清理临时文件
    echo "清理临时文件..."
    rm -f logs/*.log .pids/*.pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ 清理完成${NC}"
}

test_api() {
    echo -e "${BLUE}🧪 测试 API 连接${NC}"
    echo "====================="
    
    # 测试根路径
    echo -n "测试根路径 (/)... "
    if curl -s --max-time 5 http://localhost:3000 | grep -q "Hello World"; then
        echo -e "${GREEN}✓ 成功${NC}"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
    
    # 测试健康检查
    echo -n "测试健康检查 (/health)... "
    if curl -s --max-time 5 http://localhost:3000/health >/dev/null 2>&1; then
        echo -e "${GREEN}✓ 成功${NC}"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
    
    # 测试卡片 API
    echo -n "测试卡片 API (/cards)... "
    if curl -s --max-time 5 http://localhost:3000/cards | grep -q "\[" 2>/dev/null; then
        echo -e "${GREEN}✓ 成功${NC}"
        CARD_COUNT=$(curl -s --max-time 5 http://localhost:3000/cards | jq length 2>/dev/null || echo "?")
        echo "  返回 $CARD_COUNT 个卡片"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
    
    # 测试卡片模板 API
    echo -n "测试卡片模板 API (/cards/templates)... "
    if curl -s --max-time 5 http://localhost:3000/cards/templates >/dev/null 2>&1; then
        echo -e "${GREEN}✓ 成功${NC}"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
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
        echo -e "${BLUE}🔄 重启服务...${NC}"
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
    test)
        test_api
        ;;
    ""|help|-h|--help)
        show_help
        ;;
    *)
        echo -e "${RED}未知命令: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac 