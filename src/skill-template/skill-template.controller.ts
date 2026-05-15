import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerateSkillTemplateDto, ListSkillTemplateDto, SkillTemplateIdDto, SkillTemplateResponseDto } from './skill-template.dto';
import { SkillTemplateService } from './skill-template.service';

@ApiTags('Skill 模板模块')
@ApiBearerAuth('bearer')
@Controller('skill-template')
@UseGuards(JwtAuthGuard)
export class SkillTemplateController {
  constructor(private readonly skillTemplateService: SkillTemplateService) {}

  @Post('generate')
  @ApiOperation({ summary: '生成 Skill 模板', description: '根据名称和场景生成可复用的 skill 草稿模板。' })
  @ApiBody({ type: GenerateSkillTemplateDto })
  @ApiCreatedResponse({ type: SkillTemplateResponseDto, description: '创建成功（统一响应体：code/status/message/data/ts）' })
  generate(@Body() dto: GenerateSkillTemplateDto) {
    return this.skillTemplateService.generate(dto.name, dto.scenario);
  }

  @Get('list')
  @ApiOperation({ summary: 'Skill 模板列表', description: '按关键字与状态过滤模板列表。' })
  @ApiOkResponse({ type: [SkillTemplateResponseDto], description: '查询成功（统一响应体：code/status/message/data/ts）' })
  list(@Query() query: ListSkillTemplateDto) {
    return this.skillTemplateService.list(query);
  }

  @Post('detail')
  @ApiOperation({ summary: 'Skill 模板详情', description: '单对象查询统一使用 body.id。' })
  @ApiBody({ type: SkillTemplateIdDto })
  @ApiOkResponse({ type: SkillTemplateResponseDto, description: '查询成功（统一响应体：code/status/message/data/ts）' })
  detail(@Body() dto: SkillTemplateIdDto) {
    return this.skillTemplateService.detail(dto.id);
  }
}
