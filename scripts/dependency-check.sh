#!/bin/bash
# scripts/dependency-check.sh

echo "🔍 依赖完整性检查"
echo "====================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_package_deps() {
    local package_path=$1
    local package_name=$2
    
    echo -e "${BLUE}检查 $package_name...${NC}"
    
    if [ ! -d "$package_path" ]; then
        echo -e "${RED}✗ 目录不存在: $package_path${NC}"
        return 1
    fi
    
    if [ ! -f "$package_path/package.json" ]; then
        echo -e "${RED}✗ package.json 不存在${NC}"
        return 1
    fi
    
    if [ ! -d "$package_path/node_modules" ]; then
        echo -e "${RED}✗ $package_name 依赖未安装${NC}"
        echo "  建议运行: cd $package_path && npm install --legacy-peer-deps"
        return 1
    fi
    
    cd "$package_path"
    
    # 检查是否有缺失的依赖
    echo "  检查依赖完整性..."
    if npm ls --depth=0 >/dev/null 2>&1; then
        echo -e "${GREEN}  ✓ $package_name 依赖完整${NC}"
        
        # 显示依赖数量
        DEPS_COUNT=$(npm ls --depth=0 --json 2>/dev/null | jq '.dependencies | length' 2>/dev/null || echo "?")
        echo "    已安装 $DEPS_COUNT 个依赖包"
        
    else
        echo -e "${YELLOW}  ⚠️  $package_name 有问题的依赖${NC}"
        echo "  详细信息:"
        npm ls --depth=0 2>&1 | grep -E "(UNMET|missing|invalid|extraneous)" | head -5 | while read line; do
            echo "    $line"
        done
    fi
    
    # 检查关键依赖
    check_critical_deps "$package_name"
    
    cd - >/dev/null
    echo ""
}

check_critical_deps() {
    local package_name=$1
    
    case "$package_name" in
        "根目录")
            check_dep_exists "turbo" "Turborepo 构建工具"
            check_dep_exists "prettier" "代码格式化工具"
            ;;
        "shared-types")
            check_dep_exists "tsup" "TypeScript 构建工具"
            check_dep_exists "typescript" "TypeScript 编译器"
            ;;
        "ui")
            check_dep_exists "tsup" "TypeScript 构建工具"
            check_dep_exists "react" "React 框架"
            check_dep_exists "@repo/shared-types" "共享类型"
            ;;
        "api")
            check_dep_exists "@nestjs/core" "NestJS 核心"
            check_dep_exists "@prisma/client" "Prisma 客户端"
            check_dep_exists "typescript" "TypeScript 编译器"
            ;;
        "web")
            check_dep_exists "vite" "Vite 构建工具"
            check_dep_exists "react" "React 框架"
            check_dep_exists "axios" "HTTP 客户端"
            check_dep_exists "@repo/shared-types" "共享类型"
            ;;
        "native")
            check_dep_exists "expo" "Expo 框架"
            check_dep_exists "react-native" "React Native"
            check_dep_exists "@repo/ui" "UI 组件库"
            check_dep_exists "@repo/shared-types" "共享类型"
            ;;
    esac
}

check_dep_exists() {
    local dep_name=$1
    local dep_desc=$2
    
    if [ -d "node_modules/$dep_name" ] || npm ls "$dep_name" >/dev/null 2>&1; then
        echo -e "    ${GREEN}✓${NC} $dep_desc ($dep_name)"
    else
        echo -e "    ${RED}✗${NC} $dep_desc ($dep_name) 缺失"
    fi
}

check_build_outputs() {
    echo -e "${BLUE}检查构建输出...${NC}"
    
    # 检查 shared-types 构建
    if [ -d "packages/shared-types/dist" ]; then
        TYPE_FILES=$(find packages/shared-types/dist -name "*.d.ts" | wc -l)
        echo -e "${GREEN}✓ shared-types 已构建${NC} ($TYPE_FILES 个类型文件)"
    else
        echo -e "${RED}✗ shared-types 未构建${NC}"
        echo "  运行: cd packages/shared-types && npm run build"
    fi
    
    # 检查 ui 构建
    if [ -d "packages/ui/dist" ]; then
        UI_FILES=$(find packages/ui/dist -name "*.js" -o -name "*.d.ts" | wc -l)
        echo -e "${GREEN}✓ ui 包已构建${NC} ($UI_FILES 个输出文件)"
    else
        echo -e "${RED}✗ ui 包未构建${NC}"
        echo "  运行: cd packages/ui && npm run build"
    fi
    
    echo ""
}

check_typescript_config() {
    echo -e "${BLUE}检查 TypeScript 配置...${NC}"
    
    # 检查各包的 tsconfig.json
    local packages=("packages/shared-types" "packages/ui" "apps/api" "apps/web" "apps/native")
    
    for pkg in "${packages[@]}"; do
        if [ -f "$pkg/tsconfig.json" ]; then
            echo -e "${GREEN}✓${NC} $pkg/tsconfig.json 存在"
        else
            echo -e "${RED}✗${NC} $pkg/tsconfig.json 缺失"
        fi
    done
    
    echo ""
}

check_git_status() {
    echo -e "${BLUE}检查 Git 状态...${NC}"
    
    if [ -d ".git" ]; then
        echo -e "${GREEN}✓ Git 仓库已初始化${NC}"
        
        # 检查是否有未提交的更改
        if git diff --quiet && git diff --staged --quiet; then
            echo -e "${GREEN}✓ 工作目录干净${NC}"
        else
            echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
            echo "  运行 'git status' 查看详情"
        fi
        
        # 显示当前分支
        CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "未知")
        echo "  当前分支: $CURRENT_BRANCH"
    else
        echo -e "${RED}✗ 不是 Git 仓库${NC}"
    fi
    
    echo ""
}

check_environment() {
    echo -e "${BLUE}检查开发环境...${NC}"
    
    # 检查 Node.js 版本
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$NODE_MAJOR" -ge 18 ]; then
            echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
        else
            echo -e "${YELLOW}⚠️  Node.js $NODE_VERSION (建议 18+)${NC}"
        fi
    else
        echo -e "${RED}✗ Node.js 未安装${NC}"
    fi
    
    # 检查 npm 版本
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
    else
        echo -e "${RED}✗ npm 未安装${NC}"
    fi
    
    # 检查可选工具
    if command -v jq &> /dev/null; then
        echo -e "${GREEN}✓ jq (JSON 处理工具)${NC}"
    else
        echo -e "${YELLOW}⚠️  jq 未安装 (可选)${NC}"
    fi
    
    if command -v curl &> /dev/null; then
        echo -e "${GREEN}✓ curl (HTTP 客户端)${NC}"
    else
        echo -e "${RED}✗ curl 未安装${NC}"
    fi
    
    echo ""
}

generate_dependency_report() {
    echo -e "${BLUE}生成依赖报告...${NC}"
    
    local report_file="dependency-report.txt"
    
    cat > "$report_file" << EOF
依赖检查报告
生成时间: $(date)
====================================

环境信息:
- Node.js: $(node -v 2>/dev/null || echo "未安装")
- npm: $(npm -v 2>/dev/null || echo "未安装")
- 操作系统: $(uname -s)

包依赖状态:
EOF
    
    for pkg in "." "packages/shared-types" "packages/ui" "apps/api" "apps/web" "apps/native"; do
        echo "" >> "$report_file"
        if [ "$pkg" = "." ]; then
            echo "根目录:" >> "$report_file"
        else
            echo "$pkg:" >> "$report_file"
        fi
        
        if [ -d "$pkg/node_modules" ]; then
            cd "$pkg"
            npm ls --depth=0 2>/dev/null | head -20 >> "../$report_file" 2>/dev/null || echo "  无法读取依赖信息" >> "../$report_file"
            cd - >/dev/null
        else
            echo "  依赖未安装" >> "$report_file"
        fi
    done
    
    echo -e "${GREEN}✅ 报告已生成: $report_file${NC}"
}

# 主执行流程
echo "开始依赖检查..."
echo ""

# 检查开发环境
check_environment

# 检查各包的依赖
check_package_deps "." "根目录"
check_package_deps "packages/shared-types" "shared-types"
check_package_deps "packages/ui" "ui"
check_package_deps "apps/api" "api"
check_package_deps "apps/web" "web"
check_package_deps "apps/native" "native"

# 检查构建输出
check_build_outputs

# 检查 TypeScript 配置
check_typescript_config

# 检查 Git 状态
check_git_status

echo "🏁 依赖检查完成"

# 询问是否生成报告
echo ""
echo -n "是否生成详细的依赖报告？(y/N): "
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    generate_dependency_report
fi

echo ""
echo -e "${YELLOW}💡 修复建议:${NC}"
echo "1. 如果有依赖问题，运行: npm run setup"
echo "2. 重新安装所有依赖: ./scripts/dev.sh --clean"
echo "3. 查看健康状态: ./scripts/health-check.sh" 