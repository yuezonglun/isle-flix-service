import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type CrawlJob = { id: string; siteKey: string; status: 'queued' | 'running' | 'finished'; category?: string };

@Injectable()
export class CrawlJobService {
  private readonly jobs: CrawlJob[] = [];

  create(siteKey: string, category?: string): CrawlJob {
    const job: CrawlJob = { id: randomUUID(), siteKey, category, status: 'queued' };
    this.jobs.push(job);
    return job;
  }

  detail(id: string): CrawlJob | undefined {
    return this.jobs.find((it) => it.id === id);
  }
}
