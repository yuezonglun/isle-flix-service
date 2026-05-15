import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserParserSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(userId: string, parserSourceId: string, enabled: boolean): Promise<{ id: string; enabled: boolean }> {
    const link = await this.prisma.userParserSource.upsert({
      where: { userId_parserSourceId: { userId, parserSourceId } },
      create: { userId, parserSourceId, enabled },
      update: { enabled },
    });

    return { id: link.parserSourceId, enabled: link.enabled };
  }
}
