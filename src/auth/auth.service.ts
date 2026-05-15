import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto-login';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: {
        userRoles: {
          include: { role: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user || user.status !== CommonStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.userRoles[0]?.role.code ?? 'admin');
  }

  async refresh(): Promise<{ accessToken: string }> {
    const admin = await this.prisma.user.findUnique({
      where: { username: 'admin' },
      include: {
        userRoles: {
          include: { role: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!admin || admin.status !== CommonStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(admin.id, admin.userRoles[0]?.role.code ?? 'admin');
  }

  private async signToken(userId: string, role: string): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: userId, role });
    return { accessToken };
  }
}
