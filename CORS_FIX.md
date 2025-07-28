# 🌐 CORS跨域问题修复

## 🐛 问题描述

前端Web应用无法加载数据，持续显示加载状态，而移动端React Native应用可以正常加载数据。这是典型的CORS（跨源资源共享）问题。

## 🔍 问题分析

### **问题现象**
- ✅ **移动端React Native**: 数据加载正常
- ❌ **前端Web浏览器**: 无法加载数据，网络请求失败

### **根本原因**
1. **浏览器同源策略限制**: 前端运行在`http://localhost:5173`（Vite），尝试访问`http://localhost:3000`（API）
2. **NestJS默认无CORS配置**: 后端没有启用跨域资源共享支持
3. **预检请求失败**: OPTIONS请求被拒绝，返回404错误

### **为什么移动端正常**
React Native应用不在浏览器环境中运行，不受浏览器的同源策略限制，可以直接进行跨域请求。

## 🧪 问题验证

### **CORS预检请求测试**

#### **修复前**
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:3000/cards

# 结果: {"message":"Cannot OPTIONS /cards","error":"Not Found","statusCode":404}
```

#### **修复后**
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:3000/cards

# 结果: HTTP/1.1 204 No Content
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
# Access-Control-Allow-Headers: Content-Type,Authorization,Accept
```

## ✅ 解决方案

### **1. 在NestJS中启用CORS**

#### **修复前 - apps/api/src/main.ts**
```typescript
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}
```

#### **修复后 - apps/api/src/main.ts**
```typescript
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS支持
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite开发服务器
      'http://localhost:3000',  // 如果前端和后端在同一端口
      'http://127.0.0.1:5173',  // 备用localhost地址
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // 如果需要发送cookies
  });
  
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
  logger.log('CORS enabled for development origins');
}
```

## 🔧 CORS配置详解

### **origin (允许的源)**
```typescript
origin: [
  'http://localhost:5173',  // Vite开发服务器默认端口
  'http://localhost:3000',  // 备用端口
  'http://127.0.0.1:5173',  // 数字IP格式
  'http://127.0.0.1:3000',
]
```

### **methods (允许的HTTP方法)**
```typescript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
```

### **allowedHeaders (允许的请求头)**
```typescript
allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
```

### **credentials (凭据支持)**
```typescript
credentials: true  // 允许发送cookies和认证信息
```

## 🧪 验证结果

### **预检请求 (OPTIONS)**
```bash
✅ HTTP/1.1 204 No Content
✅ Access-Control-Allow-Origin: http://localhost:5173
✅ Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
✅ Access-Control-Allow-Headers: Content-Type,Authorization,Accept
✅ Access-Control-Allow-Credentials: true
```

### **实际请求 (GET)**
```bash
✅ HTTP/1.1 200 OK
✅ Access-Control-Allow-Origin: http://localhost:5173
✅ Access-Control-Allow-Credentials: true
✅ Content-Type: application/json; charset=utf-8
✅ 数据正常返回
```

## 📁 修复的文件

| 文件路径 | 修改内容 | 状态 |
|---------|----------|------|
| `apps/api/src/main.ts` | 添加CORS配置 | ✅ |

## 🎯 技术要点

### **CORS工作流程**
1. **预检请求**: 浏览器发送OPTIONS请求检查权限
2. **预检响应**: 服务器返回允许的源、方法、头部信息
3. **实际请求**: 浏览器发送真正的API请求
4. **响应头验证**: 浏览器验证响应头中的CORS信息

### **开发环境配置**
- **前端**: `http://localhost:5173` (Vite默认)
- **后端**: `http://localhost:3000` (NestJS默认)
- **移动端**: 不受CORS限制，直接请求

### **生产环境注意事项**
- 需要将生产环境域名添加到`origin`配置中
- 考虑使用环境变量管理不同环境的配置
- 生产环境建议更严格的CORS策略

## 🚀 项目状态

```
✅ CORS跨域问题已完全修复
✅ 前端浏览器应用可正常请求API
✅ 预检请求和实际请求都正常工作
✅ 移动端应用继续正常工作
✅ 支持所有必要的HTTP方法和请求头
🎯 前端和移动端现在都可以正常加载数据！
```

## ⚠️ 注意事项

### **安全考虑**
- 生产环境不要使用通配符`*`作为origin
- 只添加真正需要的域名到允许列表
- 谨慎使用`credentials: true`

### **调试技巧**
- 使用浏览器开发工具Network标签查看CORS错误
- 检查Console中的CORS相关错误信息
- 使用curl命令测试服务器CORS配置

### **常见CORS错误**
- `Access to fetch at '...' has been blocked by CORS policy`
- `Response to preflight request doesn't pass access control check`
- `Method ... is not allowed by Access-Control-Allow-Methods`

---

**修复完成时间**: 2025-07-28  
**问题类型**: CORS跨域资源共享  
**修复状态**: ✅ 完全修复  
**影响范围**: 前端Web应用数据加载 