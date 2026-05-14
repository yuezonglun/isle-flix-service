-- CreateEnum
CREATE TYPE "CommonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CrawlStatus" AS ENUM ('QUEUED', 'RUNNING', 'FINISHED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteProvider" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteProviderConfig" (
    "id" TEXT NOT NULL,
    "siteProviderId" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaResource" (
    "id" TEXT NOT NULL,
    "siteProviderId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "detailUrl" TEXT,
    "coverUrl" TEXT,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaEpisode" (
    "id" TEXT NOT NULL,
    "mediaResourceId" TEXT NOT NULL,
    "episodeName" TEXT NOT NULL,
    "playPageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaResourceTag" (
    "id" TEXT NOT NULL,
    "mediaResourceId" TEXT NOT NULL,
    "mediaTagId" TEXT NOT NULL,

    CONSTRAINT "MediaResourceTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParserSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParserSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserParserSource" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parserSourceId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserParserSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResolveLog" (
    "id" TEXT NOT NULL,
    "parserSourceId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResolveLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlJob" (
    "id" TEXT NOT NULL,
    "siteProviderId" TEXT NOT NULL,
    "status" "CrawlStatus" NOT NULL DEFAULT 'QUEUED',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlJobLog" (
    "id" TEXT NOT NULL,
    "crawlJobId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "taskKey" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteProvider_key_key" ON "SiteProvider"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SiteProviderConfig_siteProviderId_configKey_key" ON "SiteProviderConfig"("siteProviderId", "configKey");

-- CreateIndex
CREATE INDEX "MediaResource_title_idx" ON "MediaResource"("title");

-- CreateIndex
CREATE UNIQUE INDEX "MediaResource_siteProviderId_externalId_key" ON "MediaResource"("siteProviderId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaTag_name_key" ON "MediaTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MediaResourceTag_mediaResourceId_mediaTagId_key" ON "MediaResourceTag"("mediaResourceId", "mediaTagId");

-- CreateIndex
CREATE UNIQUE INDEX "UserParserSource_userId_parserSourceId_key" ON "UserParserSource"("userId", "parserSourceId");

-- CreateIndex
CREATE INDEX "AgentNote_taskKey_idx" ON "AgentNote"("taskKey");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteProviderConfig" ADD CONSTRAINT "SiteProviderConfig_siteProviderId_fkey" FOREIGN KEY ("siteProviderId") REFERENCES "SiteProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaResource" ADD CONSTRAINT "MediaResource_siteProviderId_fkey" FOREIGN KEY ("siteProviderId") REFERENCES "SiteProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaEpisode" ADD CONSTRAINT "MediaEpisode_mediaResourceId_fkey" FOREIGN KEY ("mediaResourceId") REFERENCES "MediaResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaResourceTag" ADD CONSTRAINT "MediaResourceTag_mediaResourceId_fkey" FOREIGN KEY ("mediaResourceId") REFERENCES "MediaResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaResourceTag" ADD CONSTRAINT "MediaResourceTag_mediaTagId_fkey" FOREIGN KEY ("mediaTagId") REFERENCES "MediaTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParserSource" ADD CONSTRAINT "UserParserSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParserSource" ADD CONSTRAINT "UserParserSource_parserSourceId_fkey" FOREIGN KEY ("parserSourceId") REFERENCES "ParserSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolveLog" ADD CONSTRAINT "ResolveLog_parserSourceId_fkey" FOREIGN KEY ("parserSourceId") REFERENCES "ParserSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlJob" ADD CONSTRAINT "CrawlJob_siteProviderId_fkey" FOREIGN KEY ("siteProviderId") REFERENCES "SiteProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Table and column comments
COMMENT ON TABLE "User" IS '系统用户';
COMMENT ON COLUMN "User"."id" IS '主键ID';
COMMENT ON COLUMN "User"."username" IS '用户名';
COMMENT ON COLUMN "User"."passwordHash" IS '密码哈希';
COMMENT ON COLUMN "User"."status" IS '用户状态';
COMMENT ON COLUMN "User"."createdAt" IS '创建时间';
COMMENT ON COLUMN "User"."updatedAt" IS '更新时间';
COMMENT ON COLUMN "User"."deletedAt" IS '删除时间（软删除）';

COMMENT ON TABLE "Role" IS '角色定义';
COMMENT ON COLUMN "Role"."id" IS '主键ID';
COMMENT ON COLUMN "Role"."code" IS '角色编码';
COMMENT ON COLUMN "Role"."name" IS '角色名称';
COMMENT ON COLUMN "Role"."createdAt" IS '创建时间';
COMMENT ON COLUMN "Role"."updatedAt" IS '更新时间';

COMMENT ON TABLE "UserRole" IS '用户角色关联';
COMMENT ON COLUMN "UserRole"."id" IS '主键ID';
COMMENT ON COLUMN "UserRole"."userId" IS '用户ID';
COMMENT ON COLUMN "UserRole"."roleId" IS '角色ID';
COMMENT ON COLUMN "UserRole"."createdAt" IS '创建时间';

COMMENT ON TABLE "SiteProvider" IS '站点提供方';
COMMENT ON COLUMN "SiteProvider"."id" IS '主键ID';
COMMENT ON COLUMN "SiteProvider"."key" IS '站点唯一标识';
COMMENT ON COLUMN "SiteProvider"."name" IS '站点名称';
COMMENT ON COLUMN "SiteProvider"."baseUrl" IS '站点基础地址';
COMMENT ON COLUMN "SiteProvider"."status" IS '状态';
COMMENT ON COLUMN "SiteProvider"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SiteProvider"."updatedAt" IS '更新时间';

COMMENT ON TABLE "SiteProviderConfig" IS '站点配置';
COMMENT ON COLUMN "SiteProviderConfig"."id" IS '主键ID';
COMMENT ON COLUMN "SiteProviderConfig"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "SiteProviderConfig"."configKey" IS '配置键';
COMMENT ON COLUMN "SiteProviderConfig"."configValue" IS '配置值';
COMMENT ON COLUMN "SiteProviderConfig"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SiteProviderConfig"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaResource" IS '媒体资源';
COMMENT ON COLUMN "MediaResource"."id" IS '主键ID';
COMMENT ON COLUMN "MediaResource"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "MediaResource"."externalId" IS '外部资源ID';
COMMENT ON COLUMN "MediaResource"."title" IS '资源标题';
COMMENT ON COLUMN "MediaResource"."category" IS '资源分类';
COMMENT ON COLUMN "MediaResource"."detailUrl" IS '详情页地址';
COMMENT ON COLUMN "MediaResource"."coverUrl" IS '封面地址';
COMMENT ON COLUMN "MediaResource"."status" IS '状态';
COMMENT ON COLUMN "MediaResource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "MediaResource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaEpisode" IS '媒体分集';
COMMENT ON COLUMN "MediaEpisode"."id" IS '主键ID';
COMMENT ON COLUMN "MediaEpisode"."mediaResourceId" IS '媒体资源ID';
COMMENT ON COLUMN "MediaEpisode"."episodeName" IS '分集名称';
COMMENT ON COLUMN "MediaEpisode"."playPageUrl" IS '播放页地址';
COMMENT ON COLUMN "MediaEpisode"."createdAt" IS '创建时间';
COMMENT ON COLUMN "MediaEpisode"."updatedAt" IS '更新时间';

COMMENT ON TABLE "MediaTag" IS '媒体标签';
COMMENT ON COLUMN "MediaTag"."id" IS '主键ID';
COMMENT ON COLUMN "MediaTag"."name" IS '标签名称';
COMMENT ON COLUMN "MediaTag"."createdAt" IS '创建时间';

COMMENT ON TABLE "MediaResourceTag" IS '媒体资源标签关联';
COMMENT ON COLUMN "MediaResourceTag"."id" IS '主键ID';
COMMENT ON COLUMN "MediaResourceTag"."mediaResourceId" IS '媒体资源ID';
COMMENT ON COLUMN "MediaResourceTag"."mediaTagId" IS '媒体标签ID';

COMMENT ON TABLE "ParserSource" IS '解析源';
COMMENT ON COLUMN "ParserSource"."id" IS '主键ID';
COMMENT ON COLUMN "ParserSource"."name" IS '解析源名称';
COMMENT ON COLUMN "ParserSource"."endpoint" IS '解析服务地址';
COMMENT ON COLUMN "ParserSource"."ownerType" IS '归属类型';
COMMENT ON COLUMN "ParserSource"."status" IS '状态';
COMMENT ON COLUMN "ParserSource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "ParserSource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "UserParserSource" IS '用户解析源配置';
COMMENT ON COLUMN "UserParserSource"."id" IS '主键ID';
COMMENT ON COLUMN "UserParserSource"."userId" IS '用户ID';
COMMENT ON COLUMN "UserParserSource"."parserSourceId" IS '解析源ID';
COMMENT ON COLUMN "UserParserSource"."enabled" IS '是否启用';
COMMENT ON COLUMN "UserParserSource"."createdAt" IS '创建时间';
COMMENT ON COLUMN "UserParserSource"."updatedAt" IS '更新时间';

COMMENT ON TABLE "ResolveLog" IS '解析日志';
COMMENT ON COLUMN "ResolveLog"."id" IS '主键ID';
COMMENT ON COLUMN "ResolveLog"."parserSourceId" IS '解析源ID';
COMMENT ON COLUMN "ResolveLog"."targetUrl" IS '目标地址';
COMMENT ON COLUMN "ResolveLog"."success" IS '是否成功';
COMMENT ON COLUMN "ResolveLog"."message" IS '结果消息';
COMMENT ON COLUMN "ResolveLog"."createdAt" IS '创建时间';

COMMENT ON TABLE "CrawlJob" IS '爬取任务';
COMMENT ON COLUMN "CrawlJob"."id" IS '主键ID';
COMMENT ON COLUMN "CrawlJob"."siteProviderId" IS '站点提供方ID';
COMMENT ON COLUMN "CrawlJob"."status" IS '任务状态';
COMMENT ON COLUMN "CrawlJob"."startedAt" IS '开始时间';
COMMENT ON COLUMN "CrawlJob"."finishedAt" IS '结束时间';
COMMENT ON COLUMN "CrawlJob"."createdAt" IS '创建时间';

COMMENT ON TABLE "CrawlJobLog" IS '爬取任务日志';
COMMENT ON COLUMN "CrawlJobLog"."id" IS '主键ID';
COMMENT ON COLUMN "CrawlJobLog"."crawlJobId" IS '爬取任务ID';
COMMENT ON COLUMN "CrawlJobLog"."level" IS '日志级别';
COMMENT ON COLUMN "CrawlJobLog"."message" IS '日志内容';
COMMENT ON COLUMN "CrawlJobLog"."createdAt" IS '创建时间';

COMMENT ON TABLE "AgentNote" IS 'Agent 协作笔记';
COMMENT ON COLUMN "AgentNote"."id" IS '主键ID';
COMMENT ON COLUMN "AgentNote"."userId" IS '用户ID（可空）';
COMMENT ON COLUMN "AgentNote"."taskKey" IS '任务键';
COMMENT ON COLUMN "AgentNote"."content" IS '笔记内容';
COMMENT ON COLUMN "AgentNote"."createdAt" IS '创建时间';

COMMENT ON TABLE "SkillTemplate" IS '技能模板';
COMMENT ON COLUMN "SkillTemplate"."id" IS '主键ID';
COMMENT ON COLUMN "SkillTemplate"."name" IS '模板名称';
COMMENT ON COLUMN "SkillTemplate"."scenario" IS '适用场景';
COMMENT ON COLUMN "SkillTemplate"."status" IS '模板状态';
COMMENT ON COLUMN "SkillTemplate"."createdAt" IS '创建时间';
COMMENT ON COLUMN "SkillTemplate"."updatedAt" IS '更新时间';

-- AddForeignKey
ALTER TABLE "CrawlJobLog" ADD CONSTRAINT "CrawlJobLog_crawlJobId_fkey" FOREIGN KEY ("crawlJobId") REFERENCES "CrawlJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentNote" ADD CONSTRAINT "AgentNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
