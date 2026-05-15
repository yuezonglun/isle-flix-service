import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exception/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function flattenValidationErrors(errors: ValidationError[]): ValidationError[] {
  const result: ValidationError[] = [];
  const stack = [...errors];

  while (stack.length > 0) {
    const current = stack.shift() as ValidationError;
    if (current.constraints && Object.keys(current.constraints).length > 0) {
      result.push(current);
    }
    if (current.children && current.children.length > 0) {
      stack.push(...current.children);
    }
  }

  return result;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // 全局参数校验：仅允许 DTO 定义字段，避免非法入参混入。
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const list = flattenValidationErrors(errors);
        return new BadRequestException({
          message: '请求参数不合法',
          validationErrors: list,
        });
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger 文档配置：统一中文描述，作为接口规范唯一来源。
  const config = new DocumentBuilder()
    .setTitle('Isle Flix 服务端接口文档')
    .setDescription('视频资源聚合服务接口文档（中文）。单对象操作统一使用 id，禁止路径参数。接口统一返回 { code, status, message, data, ts }。')
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
