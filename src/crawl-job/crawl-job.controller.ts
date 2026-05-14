import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrawlJobDetailDto, CrawlJobResponseDto, CreateCrawlJobDto } from './crawl-job.dto';
import { CrawlJobService } from './crawl-job.service';

@ApiTags('采集任务模块')
@ApiBearerAuth('bearer')
@Controller('crawl-job')
@UseGuards(JwtAuthGuard)
export class CrawlJobController {
  constructor(private readonly crawlJobService: CrawlJobService) {}

  @Post('create')
  @ApiOperation({ summary: '创建采集任务', description: '创建一个资源站目录元数据采集任务。' })
  @ApiBody({ type: CreateCrawlJobDto })
  @ApiCreatedResponse({ type: CrawlJobResponseDto, description: '创建成功' })
  create(@Body() dto: CreateCrawlJobDto) {
    return this.crawlJobService.create(dto.siteKey, dto.category);
  }

  @Get('detail')
  @ApiOperation({ summary: '采集任务详情', description: '单对象操作统一使用 query 参数 id。' })
  @ApiQuery({ name: 'id', description: '任务主键 id（UUID）', required: true, example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ type: CrawlJobResponseDto, description: '查询成功' })
  detail(@Query() query: CrawlJobDetailDto) {
    return this.crawlJobService.detail(query.id);
  }
}
