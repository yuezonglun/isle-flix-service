import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class ToggleUserParserSourceDto {
  @ApiProperty({ description: '解析源主键 id（单 id 场景统一使用 id）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: '是否启用', example: true })
  @IsBoolean()
  enabled!: boolean;
}

export class ToggleUserParserSourceResponseDto {
  @ApiProperty({ description: '解析源主键 id', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '是否启用', example: true })
  enabled!: boolean;
}
