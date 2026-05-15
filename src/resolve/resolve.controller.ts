import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResolveDto, ResolveResponseDto } from './resolve.dto';
import { ResolveService } from './resolve.service';

@ApiTags('解析模块')
@ApiBearerAuth('bearer')
@Controller()
@UseGuards(JwtAuthGuard)
export class ResolveController {
  constructor(private readonly resolveService: ResolveService) {}

  @Post('resolve')
  @ApiOperation({ summary: '资源解析', description: '多 ID 场景保留语义字段：resourceId/episodeId/parserSourceId。' })
  @ApiBody({ type: ResolveDto })
  @ApiCreatedResponse({ type: ResolveResponseDto, description: '解析成功（统一响应体：code/status/message/data/ts）' })
  resolve(@Body() dto: ResolveDto) {
    return this.resolveService.resolve(dto);
  }
}
