import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

type AgentNote = { id: string; taskKey: string; content: string; createdAt: string };

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, taskKey: string, content: string): Promise<AgentNote> {
    const note = await this.prisma.agentNote.create({
      data: { userId, taskKey, content },
    });

    await this.persistAgentMarkdown(userId);

    return {
      id: note.id,
      taskKey: note.taskKey,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    };
  }

  async search(userId: string, query: { keyword?: string; taskKey?: string }): Promise<AgentNote[]> {
    const where: Prisma.AgentNoteWhereInput = {
      userId,
      ...(query.taskKey ? { taskKey: query.taskKey } : {}),
      ...(query.keyword ? { content: { contains: query.keyword } } : {}),
    };

    const notes = await this.prisma.agentNote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return notes.map((note) => ({
      id: note.id,
      taskKey: note.taskKey,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    }));
  }

  async detail(userId: string, id: string): Promise<AgentNote | undefined> {
    const note = await this.prisma.agentNote.findFirst({
      where: { id, userId },
    });

    if (!note) return undefined;

    return {
      id: note.id,
      taskKey: note.taskKey,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    };
  }

  private async persistAgentMarkdown(userId: string): Promise<void> {
    const notes = await this.prisma.agentNote.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const dir = join(process.cwd(), 'docs', 'agents');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const body = ['# agent.md', '', ...notes.map((n) => `- [${n.taskKey}] ${n.content}`)].join('\n');
    writeFileSync(join(dir, 'agent.md'), body, 'utf-8');
  }
}
