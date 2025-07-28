import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  // 启用CORS支持
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite开发服务器
      'http://localhost:3000', // 如果前端和后端在同一端口
      'http://127.0.0.1:5173', // 备用localhost地址
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

bootstrap().catch((error) =>
  console.error('Application failed to start', error),
);
