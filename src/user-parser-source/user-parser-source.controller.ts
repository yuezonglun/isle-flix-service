import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ToggleUserParserSourceDto, ToggleUserParserSourceResponseDto } from './user-parser-source.dto';
import { UserParserSourceService } from './user-parser-source.service';

@ApiTags('用户解析源模块')
@ApiBearerAuth('bearer')
@Controller('user-parser-source')
@UseGuards(JwtAuthGuard)
export class UserParserSourceController {
  constructor(private readonly userParserSourceService: UserParserSourceService) {}

  @Post('toggle')
  @ApiOperation({ summary: '启用/禁用用户解析源', description: '单对象操作统一使用 body.id。' })
  @ApiBody({ type: ToggleUserParserSourceDto })
  @ApiOkResponse({ type: ToggleUserParserSourceResponseDto, description: '操作成功（统一响应体：code/status/message/data/ts）' })
  toggle(@Req() req: { user: { userId: string } }, @Body() dto: ToggleUserParserSourceDto) {
    return this.userParserSourceService.toggle(req.user.userId, dto.id, dto.enabled);
  }
}
