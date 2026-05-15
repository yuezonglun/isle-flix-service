# agent.md

## Purpose
记录任务级实现决策、接口规范、踩坑与复用结论，避免重复分析消耗。

## Rules
- 单对象操作接口统一使用 `id`。
- 多 ID 并存时使用语义字段（如 `resourceId`、`parserSourceId`）。
- 禁止路径参数，统一 query/body 传参。
- PostgreSQL（bgsql）所有业务表与字段必须有中文注释；迁移脚本中使用 `COMMENT ON TABLE/COLUMN` 同步维护。

## 2026-05-15 认证与核心接口去内存化决策
- 认证改为数据库校验：`auth/login` 从 `User` 表读取账号并使用 bcrypt 校验 `passwordHash`，仅 `ACTIVE` 用户可登录。
- 初始管理员与角色改为 migration SQL 初始化，避免硬编码账号密码。
- `resource`、`parser-source`、`crawl-job`、`user-parser-source`、`resolve log` 均改为 Prisma 持久化实现。
- 解析源 `enabled` 与数据库 `status` 双向映射：`ACTIVE=true`、`INACTIVE=false`。
- 按规范补充 PostgreSQL 中文注释，统一在迁移脚本中维护 `COMMENT ON TABLE/COLUMN`。
