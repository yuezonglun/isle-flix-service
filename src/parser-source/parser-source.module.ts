import { Module } from '@nestjs/common';
import { ParserSourceController } from './parser-source.controller';
import { ParserSourceService } from './parser-source.service';

@Module({
  controllers: [ParserSourceController],
  providers: [ParserSourceService],
  exports: [ParserSourceService],
})
export class ParserSourceModule {}
