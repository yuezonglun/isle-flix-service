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

-- AddForeignKey
ALTER TABLE "CrawlJobLog" ADD CONSTRAINT "CrawlJobLog_crawlJobId_fkey" FOREIGN KEY ("crawlJobId") REFERENCES "CrawlJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentNote" ADD CONSTRAINT "AgentNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
