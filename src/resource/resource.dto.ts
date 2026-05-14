import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

export class ResourceListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: '资源 id（单 id 场景只用 id）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: '标题关键字', example: '演示' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '分类', example: 'movie' })
  @IsOptional()
  @IsString()
  category?: string;
}

export class ResourceItemDto {
  @ApiProperty({ description: '资源主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '资源标题', example: 'Demo Video A' })
  title!: string;

  @ApiProperty({ description: '资源分类', example: 'movie' })
  category!: string;

  @ApiProperty({ description: '来源站点标识', example: 'yszzq' })
  siteKey!: string;
}

export class ResourceListResponseDto {
  @ApiProperty({ description: '列表数据', type: [ResourceItemDto] })
  items!: ResourceItemDto[];

  @ApiProperty({ description: '总条数', example: 1 })
  total!: number;
}

export class EpisodeDto {
  @ApiProperty({ description: '分集主键 id', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id!: string;

  @ApiProperty({ description: '所属资源 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  resourceId!: string;

  @ApiProperty({ description: '分集名称', example: 'Episode 1' })
  name!: string;

  @ApiProperty({ description: '播放页地址', example: 'https://www.yszzq.com/ziyuan/' })
  playPageUrl!: string;
}
