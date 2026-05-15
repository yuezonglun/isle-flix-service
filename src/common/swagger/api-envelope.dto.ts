import { ApiProperty } from '@nestjs/swagger';

export class ApiEnvelopeMetaDto {
  @ApiProperty({ description: '业务状态码，0 表示成功，非 0 表示失败', example: 0 })
  code!: number;

  @ApiProperty({ description: '统一业务状态：SUCCESS/FAIL', example: 'SUCCESS' })
  status!: 'SUCCESS' | 'FAIL';

  @ApiProperty({ description: '响应消息，失败时返回可确定原因的中文', example: '成功' })
  message!: string;

  @ApiProperty({ description: '响应时间（ISO 8601）', example: '2026-05-15T03:20:00.000Z' })
  ts!: string;
}
