import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CrawlJobModule } from './crawl-job/crawl-job.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { ParserSourceModule } from './parser-source/parser-source.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResolveModule } from './resolve/resolve.module';
import { ResourceModule } from './resource/resource.module';
import { SkillTemplateModule } from './skill-template/skill-template.module';
import { UserParserSourceModule } from './user-parser-source/user-parser-source.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ResourceModule,
    CrawlJobModule,
    ParserSourceModule,
    UserParserSourceModule,
    ResolveModule,
    KnowledgeModule,
    SkillTemplateModule,
  ],
})
export class AppModule {}
