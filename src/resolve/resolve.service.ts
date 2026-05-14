import { Injectable } from '@nestjs/common';

@Injectable()
export class ResolveService {
  resolve(dto: { resourceId?: string; episodeId?: string; parserSourceId: string; targetUrl: string }) {
    return {
      parserSourceId: dto.parserSourceId,
      resolvedUrl: `${dto.targetUrl}?via=${dto.parserSourceId}`,
      resourceId: dto.resourceId,
      episodeId: dto.episodeId,
    };
  }
}
