import { JwtService } from '@nestjs/jwt';
import { CommonStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  const passwordHash = '$2b$10$MSjWN0rOVBbZTSzFszP/VONd89TKZkIXar8EzODnN8JmHcoL6iXoy';

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  } as any;

  const jwtMock = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  } as unknown as JwtService;

  const service = new AuthService(jwtMock, prismaMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login success with database user and bcrypt hash', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id-1',
      username: 'admin',
      passwordHash,
      status: CommonStatus.ACTIVE,
      userRoles: [{ role: { code: 'admin' } }],
    });

    const result = await service.login({ username: 'admin', password: '123456' });

    expect(result.accessToken).toBe('jwt-token');
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { username: 'admin' } }),
    );
  });

  it('login fails when user inactive', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id-1',
      username: 'admin',
      passwordHash,
      status: CommonStatus.INACTIVE,
      userRoles: [{ role: { code: 'admin' } }],
    });

    await expect(service.login({ username: 'admin', password: '123456' })).rejects.toThrow('用户名或密码错误');
  });

  it('login fails when password mismatch', async () => {
    const wrongHash = await bcrypt.hash('abcdef', 10);
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id-1',
      username: 'admin',
      passwordHash: wrongHash,
      status: CommonStatus.ACTIVE,
      userRoles: [{ role: { code: 'admin' } }],
    });

    await expect(service.login({ username: 'admin', password: '123456' })).rejects.toThrow('用户名或密码错误');
  });
});
