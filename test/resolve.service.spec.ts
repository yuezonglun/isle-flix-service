import { NotFoundException } from '@nestjs/common';
import { ResolveService } from '../src/resolve/resolve.service';

describe('ResolveService', () => {
  const prismaMock = {
    parserSource: {
      findUnique: jest.fn(),
    },
    resolveLog: {
      create: jest.fn(),
    },
  } as any;

  const service = new ResolveService(prismaMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolve writes log and returns resolved payload when parserSource exists', async () => {
    prismaMock.parserSource.findUnique.mockResolvedValue({ id: 'ps-1' });
    prismaMock.resolveLog.create.mockResolvedValue({ id: 'log-1' });

    const result = await service.resolve({
      parserSourceId: 'ps-1',
      targetUrl: 'https://www.yszzq.com/ziyuan/',
      resourceId: 'r-1',
      episodeId: 'e-1',
    });

    expect(prismaMock.parserSource.findUnique).toHaveBeenCalledWith({
      where: { id: 'ps-1' },
      select: { id: true },
    });
    expect(prismaMock.resolveLog.create).toHaveBeenCalledWith({
      data: {
        parserSourceId: 'ps-1',
        targetUrl: 'https://www.yszzq.com/ziyuan/',
        success: true,
        message: '解析成功',
      },
    });
    expect(result).toEqual({
      parserSourceId: 'ps-1',
      resolvedUrl: 'https://www.yszzq.com/ziyuan/?via=ps-1',
      resourceId: 'r-1',
      episodeId: 'e-1',
    });
  });

  it('resolve throws 404 and does not write log when parserSource does not exist', async () => {
    prismaMock.parserSource.findUnique.mockResolvedValue(null);

    await expect(
      service.resolve({
        parserSourceId: 'missing-ps',
        targetUrl: 'https://www.yszzq.com/ziyuan/',
      }),
    ).rejects.toThrow(new NotFoundException('解析源不存在'));

    expect(prismaMock.resolveLog.create).not.toHaveBeenCalled();
  });
});
