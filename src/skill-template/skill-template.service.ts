import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

type SkillTemplate = { id: string; name: string; scenario: string; status: 'draft' | 'active'; createdAt: string };

@Injectable()
export class SkillTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(name: string, scenario: string): Promise<SkillTemplate> {
    const item = await this.prisma.skillTemplate.create({
      data: { name, scenario, status: 'draft' },
    });

    this.writeTemplateFile({
      id: item.id,
      name: item.name,
      scenario: item.scenario,
      status: this.toStatus(item.status),
      createdAt: item.createdAt.toISOString(),
    });

    return {
      id: item.id,
      name: item.name,
      scenario: item.scenario,
      status: this.toStatus(item.status),
      createdAt: item.createdAt.toISOString(),
    };
  }

  async list(query: { keyword?: string; status?: 'draft' | 'active' }): Promise<SkillTemplate[]> {
    const where: Prisma.SkillTemplateWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.keyword
        ? {
            OR: [
              { name: { contains: query.keyword } },
              { scenario: { contains: query.keyword } },
            ],
          }
        : {}),
    };

    const templates = await this.prisma.skillTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templates.map((it) => ({
      id: it.id,
      name: it.name,
      scenario: it.scenario,
      status: this.toStatus(it.status),
      createdAt: it.createdAt.toISOString(),
    }));
  }

  async detail(id: string): Promise<SkillTemplate | undefined> {
    const item = await this.prisma.skillTemplate.findUnique({ where: { id } });
    if (!item) return undefined;

    return {
      id: item.id,
      name: item.name,
      scenario: item.scenario,
      status: this.toStatus(item.status),
      createdAt: item.createdAt.toISOString(),
    };
  }

  private toStatus(status: string): 'draft' | 'active' {
    return status === 'active' ? 'active' : 'draft';
  }

  private writeTemplateFile(item: SkillTemplate): void {
    const dir = join(process.cwd(), 'docs', 'skills');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const content = `# ${item.name}\n\n## Scenario\n${item.scenario}\n\n## Inputs\n- TODO\n\n## Steps\n- TODO\n`;
    writeFileSync(join(dir, `${item.id}.md`), content, 'utf-8');
  }
}
