# AGENTS.md

## Purpose
项目级 agent 协作规范与知识沉淀入口，避免重复分析与重复提问，降低 token 消耗。

## API Rules
- 禁止路径参数（no path params）。
- 单对象查询/操作统一使用 `id`。
- 多 ID 并存时使用语义字段（如 `resourceId`、`episodeId`、`parserSourceId`）。
- 新增/修改接口时，必须同步更新 Swagger 中文注解。

## Engineering Rules
- 公共逻辑优先封装到 `src/common`。
- DTO 统一做参数校验。
- 新增模块需补充最小可用测试。
- 关键业务逻辑必须添加中文注释，解释业务意图与约束。

## Knowledge Workflow
- 任务决策与复用结论写入 `docs/agents/agent.md`。
- 新增可复用能力时，优先沉淀为 skill 模板（`docs/skills`）。

## Doc Workflow
- Swagger 是接口规范唯一来源：`/docs`、`/docs-json`。
- Apifox 从 `/docs-json` 或 `docs/openapi.json` 周期性刷新，确保联调文档一致。
- 默认使用 `npm run apifox:sync` 执行自动同步。

## Common Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Test: `npm test`
- Prisma generate: `npm run prisma:generate`
- Prisma migrate: `npm run prisma:migrate`
- Export OpenAPI: `npm run docs:openapi`
- Sync Apifox: `npm run apifox:sync`
