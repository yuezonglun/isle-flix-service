import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

describe('OpenAPI 契约测试', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('不应出现路径参数路由', () => {
    const config = new DocumentBuilder().setTitle('test').setVersion('1.0.0').build();
    const doc = SwaggerModule.createDocument(app, config);
    const hasPathParamRoute = Object.keys(doc.paths).some((path) => path.includes('{') || path.includes(':'));
    expect(hasPathParamRoute).toBe(false);
  });

  it('单对象接口应只使用 id 参数', () => {
    const config = new DocumentBuilder().setTitle('test').setVersion('1.0.0').build();
    const doc = SwaggerModule.createDocument(app, config);

    const detailParams = doc.paths['/resource-detail']?.get?.parameters ?? [];
    const paramNames = detailParams.map((p: any) => p.name);
    expect(paramNames).toContain('id');
    expect(paramNames).not.toContain('resourceId');
    expect(paramNames).not.toContain('jobId');
    expect(paramNames).not.toContain('parserSourceId');
  });

  it('多 ID 接口应保留语义字段', () => {
    const config = new DocumentBuilder().setTitle('test').setVersion('1.0.0').build();
    const doc = SwaggerModule.createDocument(app, config);

    const resolveSchemaRef = (doc.paths['/resolve']?.post as any)?.requestBody?.content?.['application/json']?.schema?.$ref as string;
    const schemaName = resolveSchemaRef.split('/').pop() as string;
    const resolveSchema = (doc.components?.schemas as any)?.[schemaName];
    const required = resolveSchema?.required ?? [];
    const props = resolveSchema?.properties ?? {};

    expect(props.resourceId).toBeDefined();
    expect(props.episodeId).toBeDefined();
    expect(props.parserSourceId).toBeDefined();
    expect(required).toContain('parserSourceId');
  });
});
