import { JwtService } from '@nestjs/jwt';
import { CommonStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  const passwordHash = '$2b$10$MSjWN0rOVBbZTSzFszP/VONd89TKZkIXar8EzODnN8JmHcoL6iXoy';

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
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

  it('register success with username and password', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'new-user-id',
      username: 'demo_user',
    });

    const result = await service.register({ username: 'demo_user', password: '123456' });

    expect(result).toEqual({ id: 'new-user-id', username: 'demo_user' });
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          username: 'demo_user',
          status: CommonStatus.ACTIVE,
        }),
      }),
    );
    const createInput = prismaMock.user.create.mock.calls[0][0];
    expect(createInput.data.passwordHash).toEqual(expect.any(String));
    expect(createInput.data.passwordHash).not.toBe('123456');
  });

  it('register fails when username already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'exists-user-id' });

    await expect(service.register({ username: 'admin', password: '123456' })).rejects.toThrow('用户名已存在');
    expect(prismaMock.user.create).not.toHaveBeenCalled();
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
