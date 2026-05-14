import { Module } from '@nestjs/common';
import { CrawlJobController } from './crawl-job.controller';
import { CrawlJobService } from './crawl-job.service';

@Module({
  controllers: [CrawlJobController],
  providers: [CrawlJobService],
})
export class CrawlJobModule {}
