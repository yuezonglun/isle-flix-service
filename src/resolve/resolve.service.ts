import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResolveService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(dto: { resourceId?: string; episodeId?: string; parserSourceId: string; targetUrl: string }) {
    const resolvedUrl = `${dto.targetUrl}?via=${dto.parserSourceId}`;

    // 解析日志入库用于追踪解析链路，便于排障与命中率统计。
    await this.prisma.resolveLog.create({
      data: {
        parserSourceId: dto.parserSourceId,
        targetUrl: dto.targetUrl,
        success: true,
        message: 'resolve success',
      },
    });

    return {
      parserSourceId: dto.parserSourceId,
      resolvedUrl,
      resourceId: dto.resourceId,
      episodeId: dto.episodeId,
    };
  }
}
