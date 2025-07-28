#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 自动更新移动端API地址脚本
 * 功能：获取开发机器IP地址并更新移动端API配置
 */

// 配置文件路径
const API_CONFIG_PATH = path.join(__dirname, '../apps/native/app/services/api.ts');

// 获取开发机器IP地址
function getDevMachineIP() {
  try {
    // 在macOS/Linux上获取非回环IP地址
    const result = execSync('ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1', { encoding: 'utf8' });
    const match = result.match(/inet (\d+\.\d+\.\d+\.\d+)/);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // 如果上面的方法失败，尝试备用方法
    const backup = execSync('hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null', { encoding: 'utf8' });
    return backup.trim().split(' ')[0];
  } catch (error) {
    console.error('❌ 无法自动获取IP地址:', error.message);
    return null;
  }
}

// 更新API配置文件
function updateApiConfig(newIP) {
  try {
    if (!fs.existsSync(API_CONFIG_PATH)) {
      console.error('❌ API配置文件不存在:', API_CONFIG_PATH);
      return false;
    }

    let content = fs.readFileSync(API_CONFIG_PATH, 'utf8');
    
    // 匹配当前的IP地址配置
    const ipRegex = /return 'http:\/\/(\d+\.\d+\.\d+\.\d+):3000';/;
    const currentMatch = content.match(ipRegex);
    
    if (currentMatch) {
      const currentIP = currentMatch[1];
      if (currentIP === newIP) {
        console.log('✅ IP地址未变化，无需更新:', newIP);
        return true;
      }
      
      // 替换IP地址
      content = content.replace(ipRegex, `return 'http://${newIP}:3000';`);
      
      // 写入文件
      fs.writeFileSync(API_CONFIG_PATH, content, 'utf8');
      
      console.log(`🔄 IP地址已更新: ${currentIP} → ${newIP}`);
      return true;
    } else {
      console.error('❌ 无法在配置文件中找到IP地址配置模式');
      return false;
    }
  } catch (error) {
    console.error('❌ 更新配置文件失败:', error.message);
    return false;
  }
}

// 验证API连接
function testApiConnection(ip) {
  try {
    console.log(`🔍 测试API连接: http://${ip}:3000/cards`);
    execSync(`curl -s --max-time 5 http://${ip}:3000/cards > /dev/null`, { stdio: 'pipe' });
    console.log('✅ API连接测试成功');
    return true;
  } catch (error) {
    console.error('❌ API连接测试失败');
    console.error('   请确保API服务正在运行: npm run dev (在apps/api目录)');
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始更新移动端API配置...\n');
  
  // 1. 获取IP地址
  console.log('📡 正在获取开发机器IP地址...');
  const currentIP = getDevMachineIP();
  
  if (!currentIP) {
    console.log('💡 请手动设置IP地址:');
    console.log('   1. 运行 ifconfig 查看网络接口');
    console.log('   2. 找到活跃的网络接口 (通常是en0或eth0)');
    console.log('   3. 手动修改 apps/native/app/services/api.ts');
    process.exit(1);
  }
  
  console.log(`📍 发现IP地址: ${currentIP}`);
  
  // 2. 更新配置文件
  console.log('\n📝 正在更新API配置文件...');
  const updateSuccess = updateApiConfig(currentIP);
  
  if (!updateSuccess) {
    process.exit(1);
  }
  
  // 3. 测试连接
  console.log('\n🔌 正在测试API连接...');
  const connectionSuccess = testApiConnection(currentIP);
  
  // 4. 显示结果
  console.log('\n📋 配置更新完成:');
  console.log(`   📱 移动端API地址: http://${currentIP}:3000`);
  console.log(`   🌐 API连接状态: ${connectionSuccess ? '✅ 正常' : '❌ 异常'}`);
  
  if (connectionSuccess) {
    console.log('\n🎉 移动端现在可以正常连接到API服务了！');
    console.log('   可以启动移动端应用进行测试: npm run android 或 npm run ios');
  } else {
    console.log('\n⚠️  API连接异常，请检查:');
    console.log('   1. API服务是否启动: cd apps/api && npm run dev');
    console.log('   2. 防火墙是否阻止3000端口');
    console.log('   3. 移动设备与开发机器是否在同一网络');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  getDevMachineIP,
  updateApiConfig,
  testApiConnection
}; 