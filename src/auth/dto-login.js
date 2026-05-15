import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '登录用户名', example: 'admin' })
  @IsString()
  username;

  @ApiProperty({ description: '登录密码，最少 6 位', example: '123456' })
  @IsString()
  @MinLength(6)
  password;
}

export class AuthTokenResponseDto {
  @ApiProperty({ description: 'JWT 访问令牌', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.yyy' })
  accessToken;
}

export class RegisterDto {
  @ApiProperty({ description: '注册用户名', example: 'demo_user' })
  @IsString()
  username;

  @ApiProperty({ description: '注册密码，仅要求字符串，暂不做复杂度验证', example: '123456' })
  @IsString()
  password;
}

export class RegisterResponseDto {
  @ApiProperty({ description: '用户主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id;

  @ApiProperty({ description: '用户名', example: 'demo_user' })
  username;
}
