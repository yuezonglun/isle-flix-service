import { SkillTemplateService } from '../src/skill-template/skill-template.service';

describe('SkillTemplateService', () => {
  const prismaMock = {
    skillTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  } as any;

  const service = new SkillTemplateService(prismaMock);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(service as any, 'writeTemplateFile').mockImplementation(() => undefined);
  });

  it('generate persists template in database', async () => {
    prismaMock.skillTemplate.create.mockResolvedValue({
      id: 's1',
      name: 'template-a',
      scenario: 'scenario-a',
      status: 'draft',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
    });

    const result = await service.generate('template-a', 'scenario-a');

    expect(prismaMock.skillTemplate.create).toHaveBeenCalledWith({
      data: { name: 'template-a', scenario: 'scenario-a', status: 'draft' },
    });
    expect(result.status).toBe('draft');
  });

  it('list queries by filters from database', async () => {
    prismaMock.skillTemplate.findMany.mockResolvedValue([
      {
        id: 's1',
        name: 'template-a',
        scenario: 'scenario-a',
        status: 'active',
        createdAt: new Date('2026-05-15T00:00:00.000Z'),
      },
    ]);

    const result = await service.list({ keyword: 'template', status: 'active' });

    expect(prismaMock.skillTemplate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'active' }) }),
    );
    expect(result[0].status).toBe('active');
  });

  it('detail reads by id from database', async () => {
    prismaMock.skillTemplate.findUnique.mockResolvedValue({
      id: 's1',
      name: 'template-a',
      scenario: 'scenario-a',
      status: 'draft',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
    });

    const result = await service.detail('s1');

    expect(prismaMock.skillTemplate.findUnique).toHaveBeenCalledWith({ where: { id: 's1' } });
    expect(result?.id).toBe('s1');
  });
});
