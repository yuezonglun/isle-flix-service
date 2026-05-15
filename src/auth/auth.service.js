import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) jwtService,
    @Inject(PrismaService) prisma,
  ) {
    this.jwtService = jwtService;
    this.prisma = prisma;
  }

  async register(dto) {
    this.ensureAuthPayload(dto);

    const exists = await this.prisma.user.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });

    if (exists) {
      throw new BadRequestException('用户名已存在');
    }

    // 业务约束：当前阶段仅创建账号密码，不接入验证码/短信等校验链路。
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        status: CommonStatus.ACTIVE,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return created;
  }

  async login(dto) {
    this.ensureAuthPayload(dto);

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
      throw new UnauthorizedException('用户名或密码错误');
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatched) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return this.signToken(user.id, user.userRoles[0]?.role.code ?? 'user');
  }

  async refresh() {
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
      throw new UnauthorizedException('管理员账号不可用');
    }

    return this.signToken(admin.id, admin.userRoles[0]?.role.code ?? 'admin');
  }

  async signToken(userId, role) {
    const accessToken = await this.jwtService.signAsync({ sub: userId, role });
    return { accessToken };
  }

  ensureAuthPayload(dto) {
    const username = typeof dto?.username === 'string' ? dto.username.trim() : '';
    const password = typeof dto?.password === 'string' ? dto.password : '';

    // 业务约束：登录/注册必须提供非空用户名与密码，避免无效入参下沉到 Prisma 导致 500。
    if (!username || !password) {
      throw new BadRequestException('用户名和密码不能为空');
    }

    dto.username = username;
    dto.password = password;
  }
}
