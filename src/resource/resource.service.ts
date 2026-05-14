import { Injectable } from '@nestjs/common';

export type Episode = { id: string; resourceId: string; name: string; playPageUrl: string };
export type ResourceItem = { id: string; title: string; category: string; siteKey: string };

@Injectable()
export class ResourceService {
  private readonly resources: ResourceItem[] = [
    { id: '11111111-1111-1111-1111-111111111111', title: 'Demo Video A', category: 'movie', siteKey: 'yszzq' },
  ];

  private readonly episodes: Episode[] = [
    {
      id: '22222222-2222-2222-2222-222222222222',
      resourceId: '11111111-1111-1111-1111-111111111111',
      name: 'Episode 1',
      playPageUrl: 'https://www.yszzq.com/ziyuan/',
    },
  ];

  list(query: { id?: string; keyword?: string; category?: string; page?: number; pageSize?: number }): { items: ResourceItem[]; total: number } {
    let data = [...this.resources];
    if (query.id) data = data.filter((it) => it.id === query.id);
    if (query.keyword) {
      const keyword = query.keyword;
      data = data.filter((it) => it.title.includes(keyword));
    }
    if (query.category) data = data.filter((it) => it.category === query.category);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    return { items: data.slice(start, start + pageSize), total: data.length };
  }

  detail(id: string): ResourceItem | undefined {
    return this.resources.find((it) => it.id === id);
  }

  episodesByResourceId(id: string): Episode[] {
    return this.episodes.filter((it) => it.resourceId === id);
  }
}
