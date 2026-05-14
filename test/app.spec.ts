import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PATH_METADATA } from '@nestjs/common/constants';
import { IdQueryDto } from '../src/common/dto/id-query.dto';
import { ResolveDto } from '../src/resolve/resolve.dto';
import { ResourceController } from '../src/resource/resource.controller';
import { CrawlJobController } from '../src/crawl-job/crawl-job.controller';
import { KnowledgeController } from '../src/knowledge/knowledge.controller';
import { ParserSourceController } from '../src/parser-source/parser-source.controller';
import { UserParserSourceController } from '../src/user-parser-source/user-parser-source.controller';

describe('API contract (id-only and no path params)', () => {
  it('single-id dto accepts id', async () => {
    const dto = plainToInstance(IdQueryDto, { id: '550e8400-e29b-41d4-a716-446655440000' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('single-id dto rejects resourceId as replacement', async () => {
    const dto = plainToInstance(IdQueryDto, { resourceId: '550e8400-e29b-41d4-a716-446655440000' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('resolve dto keeps semantic multi-id fields', async () => {
    const dto = plainToInstance(ResolveDto, {
      resourceId: '550e8400-e29b-41d4-a716-446655440000',
      episodeId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      parserSourceId: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
      targetUrl: 'https://www.yszzq.com/ziyuan/',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('all required controllers have no path parameter in base route', () => {
    const controllers = [
      ResourceController,
      CrawlJobController,
      ParserSourceController,
      UserParserSourceController,
      KnowledgeController,
    ];

    for (const controller of controllers) {
      const path = Reflect.getMetadata(PATH_METADATA, controller) as string | undefined;
      if (!path) continue;
      expect(path.includes(':')).toBe(false);
    }
  });
});
