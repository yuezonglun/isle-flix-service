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
- PostgreSQL（bgsql）中所有表和字段必须添加中文注释（`COMMENT ON TABLE/COLUMN`），新增或变更表结构时同步更新。
- 代码规范统一采用官方规范并保持一致：
  - NestJS：遵循官方模块化分层与依赖注入实践（module/service/controller/provider）。
  - TypeScript：遵循官方 Handbook 与 `strict` 思维，避免 `any`，优先精确类型。
  - Prisma：遵循官方 schema/migrate 工作流，所有结构变更走 migration。
  - class-validator/class-transformer：遵循官方 DTO 校验与转换用法。
  - Swagger（@nestjs/swagger）：遵循官方注解方式，确保请求/响应模型完整可见。
- 语言策略（新增与存量迭代）：
  - 新增模块/脚本优先使用 JavaScript（`.js`），避免新增 TypeScript（`.ts`）。
  - 存量迭代规则：当任务需要修改某个 `.ts` 文件时，优先将该“当前修改文件”迁移为对应 `.js` 文件，并在当次任务内完成引用更新与最小回归验证。
  - 迁移节奏采用“按触点逐步替换”，不做一次性全量迁移；每次只处理本次改动涉及的文件，降低风险。
  - 迁移约束：任何 `.ts -> .js` 迁移必须以“现有构建链路可运行”为前提；若受框架链路、装饰器元数据、类型声明或编译配置限制暂不可迁移，需在 `docs/agents/agent.md` 记录阻塞原因、替代方案与下一步计划。
- 公共方法封装规则：
  - 业务无关、跨模块复用 >= 2 次的方法必须沉淀到 `src/common`。
  - `src/common` 按能力拆分（如 `utils`、`guards`、`interceptors`、`constants`），禁止堆叠为单一大文件。
  - 封装公共方法时必须补充最小测试与示例用法（单测或集成测试至少其一）。
  - 新增公共方法时，在 `docs/agents/agent.md` 记录“来源问题、适用边界、禁用场景”。

## Knowledge Workflow
- 任务决策与复用结论写入 `docs/agents/agent.md`。
- 新增可复用能力时，优先沉淀为 skill 模板（`docs/skills`）。
- 发现的问题若具备复用价值（会重复出现、可形成规则、可沉淀脚手架）必须当次写入规范，不可只修代码不留结论。
- 每次任务结束至少补充 3 类信息到 `docs/agents/agent.md`：
  - 问题现象与根因（包含触发条件）。
  - 最终决策与取舍（为什么不用其他方案）。
  - 可复用资产（公共方法、脚本、skill、测试策略）。
- skill 选择与调用要记录在案：
  - 默认先判断是否需要 `find-skills` 发现可复用 skill。
  - 如果任务涉及设计/文档/表格等垂直场景，按匹配度选择对应 skill，并记录“为什么调用”。
  - 若未调用 skill，也要记录不调用理由（例如：现有规范已覆盖、任务过小）。
- 多 agent 决策规范：
  - 简单任务（单文件、小范围改动）默认单 agent，减少上下文与 token 开销。
  - 并行价值明确且写入边界互不冲突时可启用多 agent（例如：一个 agent 查文档，一个 agent 改测试）。
  - 使用多 agent 前先定义各 agent 负责文件范围，避免互相覆盖。
  - 是否启用多 agent 及原因，必须写入 `docs/agents/agent.md`。

## Skill Routing
- 默认路由：
  - 能力不明确或希望扩展能力时，先使用 `find-skills` 做 skill 发现与选择。
  - OpenAI 产品/API 类问题，使用 `openai-docs`（仅官方文档来源）。
  - GitHub PR/Issue/CI 相关任务，优先使用 `github:*` 系列 skill。
  - 文档/表格/演示文稿任务，分别使用 `documents`、`spreadsheets`、`presentations`。
- 选择原则：
  - 优先选择“最小可满足任务”的单 skill；必要时再组合多个 skill。
  - 调用前记录目标，调用后记录收益（效率、质量、复用性）。
  - 若不调用任何 skill，必须在 `docs/agents/agent.md` 写明原因。

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
