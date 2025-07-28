#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompts = [
  {
    key: 'projectName',
    question: '项目名称 (project-name): ',
    default: 'my-nestjs-project'
  },
  {
    key: 'description',
    question: '项目描述: ',
    default: 'A full-stack TypeScript project built with NestJS monorepo template'
  },
  {
    key: 'author',
    question: '作者名称 (Your Name): ',
    default: 'Your Name'
  },
  {
    key: 'gitUrl',
    question: 'Git 仓库地址 (https://github.com/username/repo): ',
    default: 'https://github.com/username/repo'
  }
];

async function askQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt.question, (answer) => {
      resolve(answer.trim() || prompt.default);
    });
  });
}

async function updatePackageJson(answers) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.name = answers.projectName;
  packageJson.description = answers.description;
  packageJson.author = answers.author;
  packageJson.repository.url = `${answers.gitUrl}.git`;
  packageJson.homepage = `${answers.gitUrl}#readme`;
  packageJson.bugs.url = `${answers.gitUrl}/issues`;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json');
}

async function updateAppPackageJsons(answers) {
  const appsDir = path.join(process.cwd(), 'apps');
  const apps = fs.readdirSync(appsDir);
  
  for (const app of apps) {
    const packageJsonPath = path.join(appsDir, app, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.name = `${answers.projectName}-${app}`;
      packageJson.description = `${answers.description} - ${app}`;
      packageJson.author = answers.author;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`✅ Updated apps/${app}/package.json`);
    }
  }
}

async function updatePackagesPackageJsons(answers) {
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs.readdirSync(packagesDir);
  
  for (const pkg of packages) {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.name = `@${answers.projectName}/${pkg}`;
      packageJson.author = answers.author;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`✅ Updated packages/${pkg}/package.json`);
    }
  }
}

async function updateReadme(answers) {
  const readmePath = path.join(process.cwd(), 'README.md');
  let content = fs.readFileSync(readmePath, 'utf8');
  
  content = content.replace(/# TypeScript 全栈卡片系统/g, `# ${answers.projectName}`);
  content = content.replace(/nestjs-monorepo-template/g, answers.projectName);
  content = content.replace(/your-username\/nestjs-monorepo-template/g, answers.gitUrl.replace('https://github.com/', ''));
  
  fs.writeFileSync(readmePath, content);
  console.log('✅ Updated README.md');
}

async function main() {
  console.log('🚀 NestJS Monorepo Template 初始化向导');
  console.log('请按提示输入项目信息，直接按回车使用默认值\n');
  
  const answers = {};
  
  for (const prompt of prompts) {
    answers[prompt.key] = await askQuestion(prompt);
  }
  
  console.log('\n📝 正在更新项目文件...\n');
  
  try {
    await updatePackageJson(answers);
    await updateAppPackageJsons(answers);
    await updatePackagesPackageJsons(answers);
    await updateReadme(answers);
    
    console.log('\n🎉 模板初始化完成！');
    console.log('\n下一步操作:');
    console.log('1. 运行 npm run setup 安装依赖并初始化数据库');
    console.log('2. 运行 npm run start 启动开发服务器');
    console.log('3. 访问 http://localhost:5173 查看 Web 应用');
    console.log('4. 使用 Expo Go 扫描二维码查看移动应用\n');
    
  } catch (error) {
    console.error('❌ 初始化过程中出现错误:', error.message);
  }
  
  rl.close();
}

main(); 