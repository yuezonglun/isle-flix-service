import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

async function main(): Promise<void> {
  // 这里创建应用上下文用于生成 OpenAPI 文档，不启动 HTTP 监听。
  const app = await NestFactory.create(AppModule, { logger: false });

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
  const outPath = process.env.OPENAPI_OUTPUT_PATH || 'docs/openapi.json';
  const abs = resolve(process.cwd(), outPath);

  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, JSON.stringify(document, null, 2), 'utf-8');

  await app.close();
  // eslint-disable-next-line no-console
  console.log(`OpenAPI 已导出: ${abs}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('OpenAPI 导出失败:', err);
  process.exit(1);
});
