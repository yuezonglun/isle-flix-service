import { Module } from '@nestjs/common';
import { UserParserSourceController } from './user-parser-source.controller';
import { UserParserSourceService } from './user-parser-source.service';

@Module({
  controllers: [UserParserSourceController],
  providers: [UserParserSourceService],
})
export class UserParserSourceModule {}
