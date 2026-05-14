import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

type SkillTemplate = { id: string; name: string; scenario: string; status: 'draft' | 'active'; createdAt: string };

@Injectable()
export class SkillTemplateService {
  private readonly templates: SkillTemplate[] = [];

  generate(name: string, scenario: string): SkillTemplate {
    const item: SkillTemplate = { id: randomUUID(), name, scenario, status: 'draft', createdAt: new Date().toISOString() };
    this.templates.push(item);
    this.writeTemplateFile(item);
    return item;
  }

  list(query: { keyword?: string; status?: 'draft' | 'active' }): SkillTemplate[] {
    return this.templates.filter((it) => {
      if (query.status && it.status !== query.status) return false;
      if (query.keyword && !`${it.name} ${it.scenario}`.includes(query.keyword)) return false;
      return true;
    });
  }

  detail(id: string): SkillTemplate | undefined {
    return this.templates.find((it) => it.id === id);
  }

  private writeTemplateFile(item: SkillTemplate): void {
    const dir = join(process.cwd(), 'docs', 'skills');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const content = `# ${item.name}\n\n## Scenario\n${item.scenario}\n\n## Inputs\n- TODO\n\n## Steps\n- TODO\n`;
    writeFileSync(join(dir, `${item.id}.md`), content, 'utf-8');
  }
}
