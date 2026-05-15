import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgentNoteDetailDto, AgentNoteResponseDto, CreateAgentNoteDto, SearchAgentNoteDto } from './knowledge.dto';
import { KnowledgeService } from './knowledge.service';

@ApiTags('知识沉淀模块')
@ApiBearerAuth('bearer')
@Controller('knowledge/agent-note')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('create')
  @ApiOperation({ summary: '创建知识记录', description: '写入任务知识，用于后续复用，减少重复分析。' })
  @ApiBody({ type: CreateAgentNoteDto })
  @ApiCreatedResponse({ type: AgentNoteResponseDto, description: '创建成功（统一响应体：code/status/message/data/ts）' })
  create(@Req() req: { user: { userId: string } }, @Body() dto: CreateAgentNoteDto) {
    return this.knowledgeService.create(req.user.userId, dto.taskKey, dto.content);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索知识记录', description: '按关键字或 taskKey 检索历史知识。' })
  @ApiOkResponse({ type: [AgentNoteResponseDto], description: '查询成功（统一响应体：code/status/message/data/ts）' })
  search(@Req() req: { user: { userId: string } }, @Query() query: SearchAgentNoteDto) {
    return this.knowledgeService.search(req.user.userId, query);
  }

  @Post('detail')
  @ApiOperation({ summary: '知识记录详情', description: '单对象查询统一使用 body.id。' })
  @ApiBody({ type: AgentNoteDetailDto })
  @ApiOkResponse({ type: AgentNoteResponseDto, description: '查询成功（统一响应体：code/status/message/data/ts）' })
  @ApiQuery({ name: 'id', required: false, description: '仅作规则提示：单对象参数统一为 id' })
  detail(@Req() req: { user: { userId: string } }, @Body() dto: AgentNoteDetailDto) {
    return this.knowledgeService.detail(req.user.userId, dto.id);
  }
}
