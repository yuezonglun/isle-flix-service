import { Injectable } from '@nestjs/common';

@Injectable()
export class UserParserSourceService {
  private readonly toggles = new Map<string, boolean>();

  toggle(id: string, enabled: boolean): { id: string; enabled: boolean } {
    this.toggles.set(id, enabled);
    return { id, enabled };
  }
}
