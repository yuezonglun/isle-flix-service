import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsUUID } from 'class-validator';

export class ResolveDto {
  @ApiPropertyOptional({ description: '资源 id（多 ID 场景保留语义名）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional({ description: '分集 id（多 ID 场景保留语义名）', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsOptional()
  @IsUUID()
  episodeId?: string;

  @ApiProperty({ description: '解析源 id（多 ID 场景保留语义名）', example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8' })
  @IsUUID()
  parserSourceId!: string;

  @ApiProperty({ description: '待解析目标地址', example: 'https://www.yszzq.com/ziyuan/' })
  @IsUrl()
  targetUrl!: string;
}

export class ResolveResponseDto {
  @ApiProperty({ description: '使用的解析源 id', example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8' })
  parserSourceId!: string;

  @ApiProperty({ description: '解析结果地址', example: 'https://www.yszzq.com/ziyuan/?via=6ba7b810-9dad-41d1-80b4-00c04fd430c8' })
  resolvedUrl!: string;

  @ApiPropertyOptional({ description: '资源 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  resourceId?: string;

  @ApiPropertyOptional({ description: '分集 id', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  episodeId?: string;
}
