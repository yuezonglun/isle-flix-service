import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type RequestLike = {
  headers?: Record<string, unknown>;
};

function getHeaderValue(req: RequestLike, key: string): string | null {
  const value = req.headers?.[key] ?? req.headers?.[key.toLowerCase()];
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0].trim();
  return null;
}

export function extractAccessToken(req: RequestLike): string | null {
  // 兼容 Apifox 等工具的多种鉴权头写法：优先标准 Bearer，其次纯 token 与 x-access-token。
  const authHeader = getHeaderValue(req, 'authorization');
  if (authHeader) {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch?.[1]) return bearerMatch[1].trim();
    return authHeader;
  }

  const accessToken = getHeaderValue(req, 'x-access-token');
  if (accessToken) return accessToken;

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractAccessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'change_me'),
    });
  }

  validate(payload: { sub: string; role: string }): { userId: string; role: string } {
    return { userId: payload.sub, role: payload.role };
  }
}
