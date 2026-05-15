import { Injectable } from '@nestjs/common';
import { CommonStatus, ParserSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParserSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(scope?: 'system' | 'user'): Promise<Array<{ id: string; name: string; endpoint: string; enabled: boolean; ownerType: 'system' | 'user' }>> {
    const sources = await this.prisma.parserSource.findMany({
      where: scope ? { ownerType: scope } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return sources.map((item) => this.toDto(item));
  }

  async create(name: string, endpoint: string): Promise<{ id: string; name: string; endpoint: string; enabled: boolean; ownerType: 'system' | 'user' }> {
    const source = await this.prisma.parserSource.create({
      data: { name, endpoint, ownerType: 'user', status: CommonStatus.ACTIVE },
    });
    return this.toDto(source);
  }

  async update(dto: {
    id: string;
    name?: string;
    endpoint?: string;
    enabled?: boolean;
  }): Promise<{ id: string; name: string; endpoint: string; enabled: boolean; ownerType: 'system' | 'user' } | undefined> {
    const source = await this.prisma.parserSource.findUnique({ where: { id: dto.id } });
    if (!source) return undefined;

    const updated = await this.prisma.parserSource.update({
      where: { id: dto.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.endpoint !== undefined ? { endpoint: dto.endpoint } : {}),
        ...(dto.enabled !== undefined ? { status: dto.enabled ? CommonStatus.ACTIVE : CommonStatus.INACTIVE } : {}),
      },
    });

    return this.toDto(updated);
  }

  private toDto(item: ParserSource): { id: string; name: string; endpoint: string; enabled: boolean; ownerType: 'system' | 'user' } {
    return {
      id: item.id,
      name: item.name,
      endpoint: item.endpoint,
      enabled: item.status === CommonStatus.ACTIVE,
      ownerType: item.ownerType as 'system' | 'user',
    };
  }
}
