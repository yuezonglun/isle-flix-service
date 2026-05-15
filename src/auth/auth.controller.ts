import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokenResponseDto, LoginDto } from './dto-login';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录', description: '使用用户名和密码登录，返回 JWT accessToken。' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: AuthTokenResponseDto, description: '登录成功（统一响应体：code/status/message/data/ts）' })
  login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新令牌', description: '刷新并返回新的 accessToken。' })
  @ApiCreatedResponse({ type: AuthTokenResponseDto, description: '刷新成功（统一响应体：code/status/message/data/ts）' })
  refresh(): Promise<{ accessToken: string }> {
    return this.authService.refresh();
  }
}
