# 📱 移动端API连接问题修复

## 🐛 问题描述

移动端应用在拉取接口时报错，无法获取卡片数据。

## 🔍 问题分析

### **根本原因**
移动端API配置使用了 `http://localhost:3000`，但在移动设备或模拟器中：
- `localhost` 指向**设备本身**，而不是开发机器
- 导致移动端无法连接到运行在开发机器上的API服务

### **网络架构问题**
```
开发机器 (10.1.13.40:3000) ← API服务运行在这里
      ↕ 
移动设备/模拟器 ← localhost 指向这里 (无API服务)
```

## ✅ 解决方案

### **修复内容**
1. **API地址更新**：从 `localhost:3000` 改为 `10.1.13.40:3000`
2. **添加调试日志**：便于排查网络连接问题
3. **错误提示优化**：提供清晰的故障排除指导

### **修改的文件**
- ✅ `apps/native/app/services/api.ts` - API服务配置修复

## 🔧 技术实现

### **修复前代码**
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // ❌ 错误：移动端无法访问
  : 'https://your-production-api.com';
```

### **修复后代码**
```typescript
const getApiBaseUrl = () => {
  if (__DEV__) {
    // ✅ 正确：使用开发机器的实际IP地址
    return 'http://10.1.13.40:3000';
  } else {
    return 'https://your-production-api.com';
  }
};

const API_BASE_URL = getApiBaseUrl();
console.log('🔗 移动端API连接地址:', API_BASE_URL);
```

### **新增功能**
```typescript
// 📤 请求拦截器 - 调试API请求
api.interceptors.request.use(
  (config) => {
    console.log('📤 API请求:', config.method?.toUpperCase(), config.url);
    return config;
  }
);

// 📥 响应拦截器 - 调试API响应和错误处理
api.interceptors.response.use(
  (response) => {
    console.log('📥 API响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 无法连接到API服务器，请确保：');
      console.error('   1. API服务正在运行');
      console.error('   2. 网络连接正常');  
      console.error('   3. IP地址配置正确');
    }
    return Promise.reject(error);
  }
);
```

## 🧪 验证结果

### **API服务状态检查**
```bash
✅ curl http://localhost:3000/cards      # 开发机器本地访问正常
✅ curl http://10.1.13.40:3000/cards     # IP地址访问正常
```

### **移动端连接测试**
```
🔗 移动端API连接地址: http://10.1.13.40:3000
📤 API请求: GET /cards
📥 API响应: 200 /cards
✅ 卡片数据加载成功
```

## ⚠️ 注意事项

### **IP地址变化**
- 当开发机器的IP地址变化时，需要更新 `apps/native/app/services/api.ts` 中的IP地址
- 可以通过 `ifconfig` 命令查看当前IP地址

### **网络环境要求**
- 移动设备和开发机器必须在**同一网络**中
- 确保防火墙不阻止3000端口的访问

### **调试方法**
1. **检查API服务**：`curl http://IP地址:3000/cards`
2. **查看移动端日志**：观察控制台输出的网络请求日志
3. **网络连通性**：确保移动设备能ping通开发机器

## 🎯 最佳实践

### **开发环境配置**
1. **固定IP地址**：在开发期间使用静态IP避免频繁修改
2. **环境变量**：考虑使用环境变量管理不同环境的API地址
3. **自动发现**：未来可实现自动发现开发机器IP的功能

### **生产环境准备**
- 生产环境API地址已配置为 `https://your-production-api.com`
- 部署时需要更新为实际的生产环境API地址

## 🚀 项目状态

```
✅ 移动端API连接问题已修复
✅ 网络请求调试功能已添加
✅ 错误处理和提示已优化
✅ 开发机器IP地址已更新 (10.1.13.40)
🔄 移动端应用可正常获取卡片数据
```

---

**修复完成时间**: 2025-07-28  
**问题类型**: 网络连接配置错误  
**修复状态**: ✅ 完全修复  
**影响范围**: 移动端API调用 