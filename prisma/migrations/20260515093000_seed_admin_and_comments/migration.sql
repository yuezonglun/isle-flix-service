-- 初始化管理员角色与账号（默认密码 123456，哈希后存储）
INSERT INTO "Role" ("id", "code", "name", "createdAt", "updatedAt")
VALUES ('11111111-1111-1111-1111-111111111111', 'admin', '系统管理员', NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW();

INSERT INTO "User" ("id", "username", "passwordHash", "status", "createdAt", "updatedAt")
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'admin',
  '$2b$10$MSjWN0rOVBbZTSzFszP/VONd89TKZkIXar8EzODnN8JmHcoL6iXoy',
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT ("username") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "status" = 'ACTIVE', "updatedAt" = NOW();

INSERT INTO "UserRole" ("id", "userId", "roleId", "createdAt")
VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW())
ON CONFLICT ("userId", "roleId") DO NOTHING;

-- 初始化站点提供方，保障 crawl-job/create 可直接联调
INSERT INTO "SiteProvider" ("id", "key", "name", "baseUrl", "status", "createdAt", "updatedAt")
VALUES ('44444444-4444-4444-4444-444444444444', 'yszzq', '影视站点-演示源', 'https://www.yszzq.com', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("key") DO UPDATE SET "name" = EXCLUDED."name", "baseUrl" = EXCLUDED."baseUrl", "status" = 'ACTIVE', "updatedAt" = NOW();

-- 初始化一条资源与分集，保障 resources/resource-detail/resource-episodes 可直接联调
INSERT INTO "MediaResource" (
  "id", "siteProviderId", "externalId", "title", "category", "detailUrl", "coverUrl", "status", "createdAt", "updatedAt"
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '44444444-4444-4444-4444-444444444444',
  'demo-video-a',
  'Demo Video A',
  'movie',
  'https://www.yszzq.com/ziyuan/',
  NULL,
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT ("siteProviderId", "externalId") DO UPDATE
SET "title" = EXCLUDED."title", "category" = EXCLUDED."category", "detailUrl" = EXCLUDED."detailUrl", "status" = 'ACTIVE', "updatedAt" = NOW();

INSERT INTO "MediaEpisode" ("id", "mediaResourceId", "episodeName", "playPageUrl", "createdAt", "updatedAt")
VALUES ('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'Episode 1', 'https://www.yszzq.com/ziyuan/', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 初始化系统解析源
INSERT INTO "ParserSource" ("id", "name", "endpoint", "ownerType", "status", "createdAt", "updatedAt")
VALUES ('77777777-7777-7777-7777-777777777777', 'system-default', 'https://parser.example.com', 'system', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

COMMENT ON TABLE "User" IS '用户表';
COMMENT ON COLUMN "User"."id" IS '主键ID';
COMMENT ON COLUMN "User"."username" IS '用户名';
COMMENT ON COLUMN "User"."passwordHash" IS '密码哈希';
COMMENT ON COLUMN "User"."status" IS '状态（ACTIVE/INACTIVE）';
COMMENT ON COLUMN "User"."createdAt" IS '创建时间';
COMMENT ON COLUMN "User"."updatedAt" IS '更新时间';
COMMENT ON COLUMN "User"."deletedAt" IS '删除时间（软删）';

COMMENT ON TABLE "Role" IS '角色表';
COMMENT ON COLUMN "Role"."id" IS '主键ID';
COMMENT ON COLUMN "Role"."code" IS '角色编码';
COMMENT ON COLUMN "Role"."name" IS '角色名称';
COMMENT ON COLUMN "Role"."createdAt" IS '创建时间';
COMMENT ON COLUMN "Role"."updatedAt" IS '更新时间';

COMMENT ON TABLE "UserRole" IS '用户角色关联表';
COMMENT ON COLUMN "UserRole"."id" IS '主键ID';
COMMENT ON COLUMN "UserRole"."userId" IS '用户ID';
COMMENT ON COLUMN "UserRole"."roleId" IS '角色ID';
COMMENT ON COLUMN "UserRole"."createdAt" IS '创建时间';

COMMENT ON TABLE "SiteProvider" IS '站点提供方表';
COMMENT ON COLUMN "SiteProvider"."id" IS '主键ID';
COMMENT ON COLUMN "SiteProvider"."key" IS '站点唯一标识';
COMMENT ON COLUMN "SiteProvider"."name" IS '站点名称';
COMMENT ON COLUMN "SiteProvider"."baseUrl" IS '站点基础地址';
COMMENT ON COLUMN "SiteProvider"."status" IS '状态（ACTIVE/INACTIVE）';
COMMENT ON COLUMN "SiteProvider"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SiteProvider"."updatedAt" IS '更新时间';

COMMENT ON TABLE "SiteProviderConfig" IS '站点配置表';
COMMENT ON COLUMN "SiteProviderConfig"."id" IS '主键ID';
COMMENT ON COLUMN "SiteProviderConfig"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "SiteProviderConfig"."configKey" IS '配置键';
COMMENT ON COLUMN "SiteProviderConfig"."configValue" IS '配置值';
COMMENT ON COLUMN "SiteProviderConfig"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SiteProviderConfig"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaResource" IS '媒体资源表';
COMMENT ON COLUMN "MediaResource"."id" IS '主键ID';
COMMENT ON COLUMN "MediaResource"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "MediaResource"."externalId" IS '站外资源ID';
COMMENT ON COLUMN "MediaResource"."title" IS '资源标题';
COMMENT ON COLUMN "MediaResource"."category" IS '资源分类';
COMMENT ON COLUMN "MediaResource"."detailUrl" IS '详情页地址';
COMMENT ON COLUMN "MediaResource"."coverUrl" IS '封面地址';
COMMENT ON COLUMN "MediaResource"."status" IS '状态（ACTIVE/INACTIVE）';
COMMENT ON COLUMN "MediaResource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "MediaResource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaEpisode" IS '媒体分集表';
COMMENT ON COLUMN "MediaEpisode"."id" IS '主键ID';
COMMENT ON COLUMN "MediaEpisode"."mediaResourceId" IS '媒体资源ID';
COMMENT ON COLUMN "MediaEpisode"."episodeName" IS '分集名称';
COMMENT ON COLUMN "MediaEpisode"."playPageUrl" IS '播放页地址';
COMMENT ON COLUMN "MediaEpisode"."createdAt" IS '创建时间';
COMMENT ON COLUMN "MediaEpisode"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaTag" IS '媒体标签表';
COMMENT ON COLUMN "MediaTag"."id" IS '主键ID';
COMMENT ON COLUMN "MediaTag"."name" IS '标签名称';
COMMENT ON COLUMN "MediaTag"."createdAt" IS '创建时间';

COMMENT ON TABLE "MediaResourceTag" IS '媒体资源标签关联表';
COMMENT ON COLUMN "MediaResourceTag"."id" IS '主键ID';
COMMENT ON COLUMN "MediaResourceTag"."mediaResourceId" IS '媒体资源ID';
COMMENT ON COLUMN "MediaResourceTag"."mediaTagId" IS '媒体标签ID';

COMMENT ON TABLE "ParserSource" IS '解析源配置表';
COMMENT ON COLUMN "ParserSource"."id" IS '主键ID';
COMMENT ON COLUMN "ParserSource"."name" IS '解析源名称';
COMMENT ON COLUMN "ParserSource"."endpoint" IS '解析服务地址';
COMMENT ON COLUMN "ParserSource"."ownerType" IS '归属类型（system/user）';
COMMENT ON COLUMN "ParserSource"."status" IS '状态（ACTIVE/INACTIVE）';
COMMENT ON COLUMN "ParserSource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "ParserSource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "UserParserSource" IS '用户解析源启用关系表';
COMMENT ON COLUMN "UserParserSource"."id" IS '主键ID';
COMMENT ON COLUMN "UserParserSource"."userId" IS '用户ID';
COMMENT ON COLUMN "UserParserSource"."parserSourceId" IS '解析源ID';
COMMENT ON COLUMN "UserParserSource"."enabled" IS '是否启用';
COMMENT ON COLUMN "UserParserSource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "UserParserSource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "ResolveLog" IS '解析日志表';
COMMENT ON COLUMN "ResolveLog"."id" IS '主键ID';
COMMENT ON COLUMN "ResolveLog"."parserSourceId" IS '解析源ID';
COMMENT ON COLUMN "ResolveLog"."targetUrl" IS '待解析地址';
COMMENT ON COLUMN "ResolveLog"."success" IS '是否成功';
COMMENT ON COLUMN "ResolveLog"."message" IS '结果说明';
COMMENT ON COLUMN "ResolveLog"."createdAt" IS '创建时间';

COMMENT ON TABLE "CrawlJob" IS '采集任务表';
COMMENT ON COLUMN "CrawlJob"."id" IS '主键ID';
COMMENT ON COLUMN "CrawlJob"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "CrawlJob"."status" IS '任务状态';
COMMENT ON COLUMN "CrawlJob"."startedAt" IS '开始时间';
COMMENT ON COLUMN "CrawlJob"."finishedAt" IS '结束时间';
COMMENT ON COLUMN "CrawlJob"."createdAt" IS '创建时间';

COMMENT ON TABLE "CrawlJobLog" IS '采集任务日志表';
COMMENT ON COLUMN "CrawlJobLog"."id" IS '主键ID';
COMMENT ON COLUMN "CrawlJobLog"."crawlJobId" IS '采集任务ID';
COMMENT ON COLUMN "CrawlJobLog"."level" IS '日志级别';
COMMENT ON COLUMN "CrawlJobLog"."message" IS '日志内容';
COMMENT ON COLUMN "CrawlJobLog"."createdAt" IS '创建时间';

COMMENT ON TABLE "AgentNote" IS '任务知识记录表';
COMMENT ON COLUMN "AgentNote"."id" IS '主键ID';
COMMENT ON COLUMN "AgentNote"."userId" IS '用户ID';
COMMENT ON COLUMN "AgentNote"."taskKey" IS '任务标识';
COMMENT ON COLUMN "AgentNote"."content" IS '知识内容';
COMMENT ON COLUMN "AgentNote"."createdAt" IS '创建时间';

COMMENT ON TABLE "SkillTemplate" IS 'Skill模板表';
COMMENT ON COLUMN "SkillTemplate"."id" IS '主键ID';
COMMENT ON COLUMN "SkillTemplate"."name" IS '模板名称';
COMMENT ON COLUMN "SkillTemplate"."scenario" IS '适用场景';
COMMENT ON COLUMN "SkillTemplate"."status" IS '模板状态';
COMMENT ON COLUMN "SkillTemplate"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SkillTemplate"."updatedAt" IS '更新时间';
