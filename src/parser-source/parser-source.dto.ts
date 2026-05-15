import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class ListParserSourceDto {
  @ApiPropertyOptional({ description: '查询范围：system 或 user', example: 'system' })
  @IsOptional()
  @IsIn(['system', 'user'])
  @IsString()
  scope?: 'system' | 'user';
}

export class CreateParserSourceDto {
  @ApiProperty({ description: '解析源名称', example: '系统默认解析源' })
  @IsString()
  name!: string;

  @ApiProperty({ description: '解析服务地址', example: 'https://parser.example.com' })
  @IsUrl()
  endpoint!: string;
}

export class UpdateParserSourceDto {
  @ApiProperty({ description: '解析源主键 id（单 id 场景统一使用 id）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({ description: '解析源名称', example: '用户自定义解析源' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '解析服务地址', example: 'https://example.com/parser' })
  @IsOptional()
  @IsUrl()
  endpoint?: string;

  @ApiPropertyOptional({ description: '是否启用', example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class ParserSourceDto {
  @ApiProperty({ description: '解析源主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '解析源名称', example: 'system-default' })
  name!: string;

  @ApiProperty({ description: '解析服务地址', example: 'https://parser.example.com' })
  endpoint!: string;

  @ApiProperty({ description: '是否启用', example: true })
  enabled!: boolean;

  @ApiProperty({ description: '归属类型', example: 'system' })
  ownerType!: 'system' | 'user';
}
