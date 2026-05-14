import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto-login';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    if (dto.username !== 'admin' || dto.password !== '123456') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwtService.signAsync({ sub: 'admin-user-id', role: 'admin' });
    return { accessToken };
  }

  async refresh(): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: 'admin-user-id', role: 'admin' });
    return { accessToken };
  }
}
