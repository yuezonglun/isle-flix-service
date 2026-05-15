import { CommonStatus } from '@prisma/client';
import { ResourceService } from '../src/resource/resource.service';

describe('ResourceService', () => {
  const prismaMock = {
    mediaResource: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    mediaEpisode: {
      findMany: jest.fn(),
    },
  } as any;

  const service = new ResourceService(prismaMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list supports pagination and keyword/category filters', async () => {
    prismaMock.mediaResource.findMany.mockResolvedValue([
      {
        id: 'r1',
        title: 'Demo Video A',
        category: 'movie',
        siteProvider: { key: 'yszzq' },
      },
    ]);
    prismaMock.mediaResource.count.mockResolvedValue(1);

    const result = await service.list({ keyword: 'Demo', category: 'movie', page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(result.items[0]).toEqual({ id: 'r1', title: 'Demo Video A', category: 'movie', siteKey: 'yszzq' });
    expect(prismaMock.mediaResource.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: CommonStatus.ACTIVE, category: 'movie' }),
      }),
    );
  });

  it('detail queries by id and maps siteKey', async () => {
    prismaMock.mediaResource.findFirst.mockResolvedValue({
      id: 'r1',
      title: 'Demo Video A',
      category: 'movie',
      siteProvider: { key: 'yszzq' },
    });

    const result = await service.detail('r1');

    expect(result).toEqual({ id: 'r1', title: 'Demo Video A', category: 'movie', siteKey: 'yszzq' });
  });

  it('episodes query by resourceId', async () => {
    prismaMock.mediaEpisode.findMany.mockResolvedValue([
      { id: 'e1', mediaResourceId: 'r1', episodeName: 'Episode 1', playPageUrl: 'https://x.test' },
    ]);

    const result = await service.episodesByResourceId('r1');

    expect(result).toEqual([{ id: 'e1', resourceId: 'r1', name: 'Episode 1', playPageUrl: 'https://x.test' }]);
  });
});
