import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdQueryDto {
  @ApiProperty({ description: '单对象操作统一主键 id（UUID）', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;
}
