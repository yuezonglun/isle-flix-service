import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '登录用户名', example: 'admin' })
  @IsString()
  username!: string;

  @ApiProperty({ description: '登录密码，最少 6 位', example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class AuthTokenResponseDto {
  @ApiProperty({ description: 'JWT 访问令牌', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.yyy' })
  accessToken!: string;
}
