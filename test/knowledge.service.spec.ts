import { KnowledgeService } from '../src/knowledge/knowledge.service';

describe('KnowledgeService', () => {
  const prismaMock = {
    agentNote: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  } as any;

  const service = new KnowledgeService(prismaMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create persists note into database', async () => {
    prismaMock.agentNote.create.mockResolvedValue({
      id: 'n1',
      taskKey: 'task-a',
      content: 'content-a',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
    });
    prismaMock.agentNote.findMany.mockResolvedValue([
      {
        id: 'n1',
        taskKey: 'task-a',
        content: 'content-a',
        createdAt: new Date('2026-05-15T00:00:00.000Z'),
      },
    ]);

    const result = await service.create('u1', 'task-a', 'content-a');

    expect(prismaMock.agentNote.create).toHaveBeenCalledWith({ data: { userId: 'u1', taskKey: 'task-a', content: 'content-a' } });
    expect(result.id).toBe('n1');
  });

  it('search filters in database by user and keyword/taskKey', async () => {
    prismaMock.agentNote.findMany.mockResolvedValue([
      {
        id: 'n1',
        taskKey: 'task-a',
        content: 'content-a',
        createdAt: new Date('2026-05-15T00:00:00.000Z'),
      },
    ]);

    const result = await service.search('u1', { keyword: 'content', taskKey: 'task-a' });

    expect(prismaMock.agentNote.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'u1', taskKey: 'task-a' }),
      }),
    );
    expect(result).toHaveLength(1);
  });

  it('detail queries database by id and userId', async () => {
    prismaMock.agentNote.findFirst.mockResolvedValue({
      id: 'n1',
      taskKey: 'task-a',
      content: 'content-a',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
    });

    const result = await service.detail('u1', 'n1');

    expect(prismaMock.agentNote.findFirst).toHaveBeenCalledWith({ where: { id: 'n1', userId: 'u1' } });
    expect(result?.id).toBe('n1');
  });
});
