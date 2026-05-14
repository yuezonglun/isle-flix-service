import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

type AgentNote = { id: string; taskKey: string; content: string; createdAt: string };

@Injectable()
export class KnowledgeService {
  private readonly notes: AgentNote[] = [];

  create(taskKey: string, content: string): AgentNote {
    const note: AgentNote = { id: randomUUID(), taskKey, content, createdAt: new Date().toISOString() };
    this.notes.push(note);
    this.persistAgentMarkdown();
    return note;
  }

  search(query: { keyword?: string; taskKey?: string }): AgentNote[] {
    return this.notes.filter((it) => {
      if (query.taskKey && it.taskKey !== query.taskKey) return false;
      if (query.keyword && !it.content.includes(query.keyword)) return false;
      return true;
    });
  }

  detail(id: string): AgentNote | undefined {
    return this.notes.find((it) => it.id === id);
  }

  private persistAgentMarkdown(): void {
    const dir = join(process.cwd(), 'docs', 'agents');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const body = ['# agent.md', '', ...this.notes.map((n) => `- [${n.taskKey}] ${n.content}`)].join('\n');
    writeFileSync(join(dir, 'agent.md'), body, 'utf-8');
  }
}
