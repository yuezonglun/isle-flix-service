import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAgentNoteDto {
  @ApiProperty({ description: '任务标识', example: 'video-resource-v1' })
  @IsString()
  taskKey!: string;

  @ApiProperty({ description: '任务知识内容', example: '统一约定单对象参数使用 id。' })
  @IsString()
  content!: string;
}

export class SearchAgentNoteDto {
  @ApiPropertyOptional({ description: '关键字搜索', example: 'id' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '任务标识过滤', example: 'video-resource-v1' })
  @IsOptional()
  @IsString()
  taskKey?: string;
}

export class AgentNoteDetailDto {
  @ApiProperty({ description: '知识记录主键 id（单 id 场景统一使用 id）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;
}

export class AgentNoteResponseDto {
  @ApiProperty({ description: '知识记录主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '任务标识', example: 'video-resource-v1' })
  taskKey!: string;

  @ApiProperty({ description: '知识内容', example: '统一约定单对象参数使用 id。' })
  content!: string;

  @ApiProperty({ description: '创建时间', example: '2026-05-14T12:00:00.000Z' })
  createdAt!: string;
}
