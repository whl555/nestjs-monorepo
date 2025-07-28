#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2] || 'ts-fullstack';

console.log(`🚀 创建新的 NestJS Monorepo 项目: ${projectName}`);

try {
  // 克隆模板
  console.log('📥 下载模板...');
  execSync(`git clone https://github.com/wuhaolei455/nestjs-monorepo.git ${projectName}`, { stdio: 'inherit' });
  
  // 进入项目目录
  process.chdir(projectName);
  
  // 删除 .git 目录
  console.log('🧹 清理模板文件...');
  if (fs.existsSync('.git')) {
    fs.rmSync('.git', { recursive: true, force: true });
  }
  
  // 初始化新的 git 仓库
  console.log('🔧 初始化 Git 仓库...');
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Initial commit from nestjs-monorepo-template"', { stdio: 'inherit' });
  
  console.log(`\n✅ 项目创建成功！`);
  console.log(`\n📁 进入项目目录:`);
  console.log(`   cd ${projectName}`);
  console.log(`\n🎯 运行初始化向导:`);
  console.log(`   npm run template:init`);
  console.log(`\n🚀 或直接开始开发:`);
  console.log(`   npm run setup    # 安装依赖并初始化`);
  console.log(`   npm run start    # 启动开发服务器`);
  
} catch (error) {
  console.error('❌ 创建项目时出现错误:', error.message);
  process.exit(1);
} 