import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateSkillTemplateDto {
  @ApiProperty({ description: 'skill 模板名称', example: '解析源切换规范' })
  @IsString()
  name!: string;

  @ApiProperty({ description: '适用场景描述', example: '用户需要在客户端切换解析源时使用。' })
  @IsString()
  scenario!: string;
}

export class ListSkillTemplateDto {
  @ApiPropertyOptional({ description: '关键字过滤', example: '解析源' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '状态过滤', example: 'draft' })
  @IsOptional()
  @IsString()
  status?: 'draft' | 'active';
}

export class SkillTemplateIdDto {
  @ApiProperty({ description: 'skill 模板主键 id（单 id 场景统一使用 id）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;
}

export class SkillTemplateResponseDto {
  @ApiProperty({ description: '模板主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '模板名称', example: '解析源切换规范' })
  name!: string;

  @ApiProperty({ description: '场景说明', example: '用户需要在客户端切换解析源时使用。' })
  scenario!: string;

  @ApiProperty({ description: '模板状态', example: 'draft' })
  status!: 'draft' | 'active';

  @ApiProperty({ description: '创建时间', example: '2026-05-14T12:00:00.000Z' })
  createdAt!: string;
}
