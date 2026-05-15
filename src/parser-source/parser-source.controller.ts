import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateParserSourceDto, ListParserSourceDto, ParserSourceDto, UpdateParserSourceDto } from './parser-source.dto';
import { ParserSourceService } from './parser-source.service';

@ApiTags('解析源模块')
@ApiBearerAuth('bearer')
@Controller()
@UseGuards(JwtAuthGuard)
export class ParserSourceController {
  constructor(private readonly parserSourceService: ParserSourceService) {}

  @Get('parser-sources')
  @ApiOperation({ summary: '解析源列表', description: '按 system/user 范围查询解析源配置列表。' })
  @ApiOkResponse({ type: [ParserSourceDto], description: '查询成功（统一响应体：code/status/message/data/ts）' })
  list(@Query() query: ListParserSourceDto) {
    return this.parserSourceService.list(query.scope);
  }

  @Post('parser-source/create')
  @ApiOperation({ summary: '创建解析源', description: '新增用户自定义解析源。' })
  @ApiBody({ type: CreateParserSourceDto })
  @ApiCreatedResponse({ type: ParserSourceDto, description: '创建成功（统一响应体：code/status/message/data/ts）' })
  create(@Body() dto: CreateParserSourceDto) {
    return this.parserSourceService.create(dto.name, dto.endpoint);
  }

  @Post('parser-source/update')
  @ApiOperation({ summary: '更新解析源', description: '单对象更新统一使用 body.id。' })
  @ApiBody({ type: UpdateParserSourceDto })
  @ApiOkResponse({ type: ParserSourceDto, description: '更新成功（统一响应体：code/status/message/data/ts）' })
  update(@Body() dto: UpdateParserSourceDto) {
    return this.parserSourceService.update(dto);
  }
}
