import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // 全局参数校验：仅允许 DTO 定义字段，避免非法入参混入。
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger 文档配置：统一中文描述，作为接口规范唯一来源。
  const config = new DocumentBuilder()
    .setTitle('Isle Flix 服务端接口文档')
    .setDescription('视频资源聚合服务接口文档（中文）。单对象操作统一使用 id，禁止路径参数。')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '先调用 /auth/login 获取 accessToken，再在此处填入。',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(4000);
}

bootstrap();
