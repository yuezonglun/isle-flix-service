import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResolveService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(dto: { resourceId?: string; episodeId?: string; parserSourceId: string; targetUrl: string }) {
    const parserSource = await this.prisma.parserSource.findUnique({
      where: { id: dto.parserSourceId },
      select: { id: true },
    });

    // 业务前置校验：不存在的解析源直接返回 404，避免下沉到外键错误。
    if (!parserSource) {
      throw new NotFoundException('解析源不存在');
    }

    const resolvedUrl = `${dto.targetUrl}?via=${dto.parserSourceId}`;

    // 解析日志入库用于追踪解析链路，便于排障与命中率统计。
    await this.prisma.resolveLog.create({
      data: {
        parserSourceId: dto.parserSourceId,
        targetUrl: dto.targetUrl,
        success: true,
        message: '解析成功',
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
