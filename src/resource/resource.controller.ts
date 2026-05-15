import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdQueryDto } from '../common/dto/id-query.dto';
import { EpisodeDto, ResourceItemDto, ResourceListQueryDto, ResourceListResponseDto } from './resource.dto';
import { ResourceService } from './resource.service';

@ApiTags('资源模块')
@ApiBearerAuth('bearer')
@Controller()
@UseGuards(JwtAuthGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('resources')
  @ApiOperation({ summary: '资源列表查询', description: '支持按 id/关键字/分类分页查询资源列表。' })
  @ApiOkResponse({ type: ResourceListResponseDto, description: '查询成功（统一响应体：code/status/message/data/ts）' })
  list(@Query() query: ResourceListQueryDto) {
    return this.resourceService.list(query);
  }

  @Get('resource-detail')
  @ApiOperation({ summary: '资源详情查询', description: '单对象操作统一使用 query 参数 id，不使用路径参数。' })
  @ApiQuery({ name: 'id', description: '资源主键 id（UUID）', required: true, example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ type: ResourceItemDto, description: '查询成功（统一响应体：code/status/message/data/ts）' })
  detail(@Query() query: IdQueryDto) {
    return this.resourceService.detail(query.id);
  }

  @Get('resource-episodes')
  @ApiOperation({ summary: '资源分集查询', description: '按资源 id 查询分集列表，单对象参数统一使用 id。' })
  @ApiQuery({ name: 'id', description: '资源主键 id（UUID）', required: true, example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ type: [EpisodeDto], description: '查询成功（统一响应体：code/status/message/data/ts）' })
  episodes(@Query() query: IdQueryDto) {
    return this.resourceService.episodesByResourceId(query.id);
  }
}
