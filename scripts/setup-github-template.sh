#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GitHub 模板仓库设置向导${NC}"
echo "=============================================="

# 检查 git 是否已安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装，请先安装 Git${NC}"
    exit 1
fi

# 检查 gh CLI 是否已安装
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI 未安装，将使用手动方式${NC}"
    echo "建议安装 GitHub CLI: https://cli.github.com/"
    USE_GH_CLI=false
else
    USE_GH_CLI=true
fi

# 获取用户输入
echo ""
read -p "GitHub 用户名: " GITHUB_USERNAME
read -p "仓库名称 (默认: nestjs-monorepo-template): " REPO_NAME
REPO_NAME=${REPO_NAME:-nestjs-monorepo-template}

read -p "仓库描述: " REPO_DESCRIPTION
REPO_DESCRIPTION=${REPO_DESCRIPTION:-"🚀 A full-stack TypeScript monorepo template with NestJS, React, React Native, and configurable card system"}

# 确认信息
echo ""
echo -e "${BLUE}📋 确认信息:${NC}"
echo "GitHub 用户名: $GITHUB_USERNAME"
echo "仓库名称: $REPO_NAME"
echo "仓库描述: $REPO_DESCRIPTION"
echo ""
read -p "确认创建? (y/N): " CONFIRM

if [[ $CONFIRM != [yY] && $CONFIRM != [yY][eE][sS] ]]; then
    echo -e "${YELLOW}⛔ 操作已取消${NC}"
    exit 0
fi

# 更新 package.json 中的仓库信息
echo -e "${BLUE}📝 更新 package.json...${NC}"
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" package.json
sed -i.bak "s|nestjs-monorepo-template|$REPO_NAME|g" package.json
rm package.json.bak

# 更新脚本中的仓库信息
echo -e "${BLUE}📝 更新脚本文件...${NC}"
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" scripts/create-template.js
rm scripts/create-template.js.bak

# 初始化 Git 仓库
if [ ! -d ".git" ]; then
    echo -e "${BLUE}🔧 初始化 Git 仓库...${NC}"
    git init
    git add .
    git commit -m "Initial commit: NestJS Monorepo Template"
else
    echo -e "${BLUE}🔧 添加更改到 Git...${NC}"
    git add .
    git commit -m "Update template configuration for GitHub"
fi

# 创建 GitHub 仓库
if [ "$USE_GH_CLI" = true ]; then
    echo -e "${BLUE}📡 使用 GitHub CLI 创建仓库...${NC}"
    
    # 检查是否已登录
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}🔐 请先登录 GitHub CLI...${NC}"
        gh auth login
    fi
    
    # 创建仓库（作为模板）
    gh repo create "$GITHUB_USERNAME/$REPO_NAME" \
        --public \
        --description "$REPO_DESCRIPTION" \
        --source=. \
        --push
    
    # 设置为模板仓库（需要通过 API）
    echo -e "${BLUE}⚙️  设置为模板仓库...${NC}"
    gh api repos/$GITHUB_USERNAME/$REPO_NAME --method PATCH --field is_template=true
    
    echo -e "${GREEN}✅ 仓库创建成功！${NC}"
    echo -e "${BLUE}🔗 仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
    
else
    echo -e "${YELLOW}📡 手动创建 GitHub 仓库...${NC}"
    echo ""
    echo "请按以下步骤手动创建仓库:"
    echo "1. 访问 https://github.com/new"
    echo "2. 仓库名称: $REPO_NAME"
    echo "3. 描述: $REPO_DESCRIPTION"
    echo "4. 选择 Public"
    echo "5. ✅ 勾选 'Template repository'"
    echo "6. 点击 'Create repository'"
    echo ""
    read -p "完成后按回车继续..."
    
    # 添加远程仓库并推送
    echo -e "${BLUE}📤 推送代码到 GitHub...${NC}"
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    git branch -M main
    git push -u origin main
fi

# 显示后续步骤
echo ""
echo -e "${GREEN}🎉 GitHub 模板仓库设置完成！${NC}"
echo ""
echo -e "${BLUE}📋 后续步骤:${NC}"
echo "1. 访问仓库设置页面，确认以下选项已启用："
echo "   - ✅ Template repository"
echo "   - ✅ Issues"
echo "   - ✅ Discussions (可选)"
echo ""
echo "2. 在仓库首页添加主题标签:"
echo "   typescript, nestjs, react, react-native, monorepo, template, fullstack"
echo ""
echo "3. 发布到 NPM (可选):"
echo "   npm login"
echo "   npm publish"
echo ""
echo -e "${BLUE}🔗 仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "${BLUE}🎯 使用方式: https://github.com/$GITHUB_USERNAME/$REPO_NAME/generate${NC}"
echo ""
echo -e "${GREEN}✨ 模板已就绪，开始分享给其他开发者吧！${NC}" 