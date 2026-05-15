import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokenResponseDto, LoginDto, RegisterDto, RegisterResponseDto } from './dto-login';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) authService) {
    this.authService = authService;
  }

  @Post('register')
  @ApiOperation({ summary: '创建用户账号', description: '仅使用账号密码创建用户，当前阶段不做验证码等额外验证。' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: RegisterResponseDto, description: '创建成功（统一响应体：code/status/message/data/ts）' })
  register(@Body() dto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录', description: '使用用户名和密码登录，返回 JWT accessToken。' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: AuthTokenResponseDto, description: '登录成功（统一响应体：code/status/message/data/ts）' })
  login(@Body() dto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新令牌', description: '刷新并返回新的 accessToken。' })
  @ApiCreatedResponse({ type: AuthTokenResponseDto, description: '刷新成功（统一响应体：code/status/message/data/ts）' })
  refresh() {
    return this.authService.refresh();
  }
}
