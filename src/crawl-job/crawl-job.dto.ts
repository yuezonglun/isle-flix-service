import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCrawlJobDto {
  @ApiProperty({ description: '站点标识', example: 'yszzq' })
  @IsString()
  siteKey!: string;

  @ApiPropertyOptional({ description: '可选分类过滤', example: 'movie' })
  @IsOptional()
  @IsString()
  category?: string;
}

export class CrawlJobDetailDto {
  @ApiProperty({ description: '任务主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;
}

export class CrawlJobResponseDto {
  @ApiProperty({ description: '任务主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '站点标识', example: 'yszzq' })
  siteKey!: string;

  @ApiPropertyOptional({ description: '任务分类', example: 'movie' })
  category?: string;

  @ApiProperty({ description: '任务状态', example: 'queued' })
  status!: 'queued' | 'running' | 'finished';
}
