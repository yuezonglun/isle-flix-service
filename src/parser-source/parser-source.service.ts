import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type ParserSource = { id: string; name: string; endpoint: string; enabled: boolean; ownerType: 'system' | 'user' };

@Injectable()
export class ParserSourceService {
  private readonly sources: ParserSource[] = [
    { id: randomUUID(), name: 'system-default', endpoint: 'https://parser.example.com', enabled: true, ownerType: 'system' },
  ];

  list(scope?: 'system' | 'user'): ParserSource[] {
    if (!scope) return this.sources;
    return this.sources.filter((it) => it.ownerType === scope);
  }

  create(name: string, endpoint: string): ParserSource {
    const source: ParserSource = { id: randomUUID(), name, endpoint, enabled: true, ownerType: 'user' };
    this.sources.push(source);
    return source;
  }

  update(dto: { id: string; name?: string; endpoint?: string; enabled?: boolean }): ParserSource | undefined {
    const item = this.sources.find((it) => it.id === dto.id);
    if (!item) return undefined;
    if (dto.name !== undefined) item.name = dto.name;
    if (dto.endpoint !== undefined) item.endpoint = dto.endpoint;
    if (dto.enabled !== undefined) item.enabled = dto.enabled;
    return item;
  }
}
