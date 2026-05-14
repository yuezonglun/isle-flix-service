import { Module } from '@nestjs/common';
import { SkillTemplateController } from './skill-template.controller';
import { SkillTemplateService } from './skill-template.service';

@Module({
  controllers: [SkillTemplateController],
  providers: [SkillTemplateService],
})
export class SkillTemplateModule {}
