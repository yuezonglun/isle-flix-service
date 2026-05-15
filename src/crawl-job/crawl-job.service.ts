import { Injectable, NotFoundException } from '@nestjs/common';
import { CrawlStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CrawlJob = { id: string; siteKey: string; status: 'queued' | 'running' | 'finished' | 'failed'; category?: string };

@Injectable()
export class CrawlJobService {
  constructor(private readonly prisma: PrismaService) {}

  // 采集任务创建时需要先定位站点提供方，确保任务和站点维度关联可追踪。
  async create(siteKey: string, category?: string): Promise<CrawlJob> {
    const siteProvider = await this.prisma.siteProvider.findUnique({ where: { key: siteKey } });
    if (!siteProvider) {
      throw new NotFoundException('site provider not found');
    }

    const job = await this.prisma.crawlJob.create({
      data: {
        siteProviderId: siteProvider.id,
        status: CrawlStatus.QUEUED,
        logs: category
          ? {
              create: { level: 'INFO', message: `category=${category}` },
            }
          : undefined,
      },
      include: { siteProvider: true, logs: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });

    return {
      id: job.id,
      siteKey: job.siteProvider.key,
      status: this.toStatus(job.status),
      category: job.logs[0]?.message.startsWith('category=') ? job.logs[0].message.replace('category=', '') : undefined,
    };
  }

  async detail(id: string): Promise<CrawlJob | undefined> {
    const job = await this.prisma.crawlJob.findUnique({
      where: { id },
      include: { siteProvider: true, logs: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });
    if (!job) return undefined;

    return {
      id: job.id,
      siteKey: job.siteProvider.key,
      status: this.toStatus(job.status),
      category: job.logs[0]?.message.startsWith('category=') ? job.logs[0].message.replace('category=', '') : undefined,
    };
  }

  private toStatus(status: CrawlStatus): 'queued' | 'running' | 'finished' | 'failed' {
    if (status === CrawlStatus.RUNNING) return 'running';
    if (status === CrawlStatus.FINISHED) return 'finished';
    if (status === CrawlStatus.FAILED) return 'failed';
    return 'queued';
  }
}
