import { Injectable } from '@nestjs/common';
import { CommonStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type Episode = { id: string; resourceId: string; name: string; playPageUrl: string };
export type ResourceItem = { id: string; title: string; category: string; siteKey: string };

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: {
    id?: string;
    keyword?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ResourceItem[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const where: Prisma.MediaResourceWhereInput = {
      status: CommonStatus.ACTIVE,
      ...(query.id ? { id: query.id } : {}),
      ...(query.keyword ? { title: { contains: query.keyword } } : {}),
      ...(query.category ? { category: query.category } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.mediaResource.findMany({
        where,
        include: { siteProvider: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mediaResource.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category ?? '',
        siteKey: item.siteProvider.key,
      })),
      total,
    };
  }

  async detail(id: string): Promise<ResourceItem | undefined> {
    const item = await this.prisma.mediaResource.findFirst({
      where: { id, status: CommonStatus.ACTIVE },
      include: { siteProvider: true },
    });

    if (!item) return undefined;

    return {
      id: item.id,
      title: item.title,
      category: item.category ?? '',
      siteKey: item.siteProvider.key,
    };
  }

  async episodesByResourceId(id: string): Promise<Episode[]> {
    const episodes = await this.prisma.mediaEpisode.findMany({
      where: { mediaResourceId: id },
      orderBy: { createdAt: 'asc' },
    });

    return episodes.map((episode) => ({
      id: episode.id,
      resourceId: episode.mediaResourceId,
      name: episode.episodeName,
      playPageUrl: episode.playPageUrl,
    }));
  }
}
