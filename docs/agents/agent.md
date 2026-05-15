# agent.md

## [2026-05-15] auth/login PrismaClientValidationError（username 为 undefined）

### 1) 问题现象与根因（含触发条件）
- 现象：`POST /auth/login` 返回 500，Prisma 报错 `UserWhereUniqueInput needs at least one of id or username`。
- 触发条件：请求体缺失 `username`（或为仅空白字符串）时，`AuthService.login` 直接执行 `findUnique({ where: { username: dto.username } })`，将 `undefined` 下沉到 Prisma。
- 根因：服务层缺少兜底参数断言，导致无效入参未在业务边界被拦截并转化为 4xx。

### 2) 最终决策与取舍
- 决策：在 `src/auth/auth.service.js` 增加 `ensureAuthPayload(dto)`，并在 `register/login` 入口统一调用；当用户名或密码为空时抛出 `BadRequestException('用户名和密码不能为空')`。
- 取舍：
  - 未仅依赖 DTO 校验：即便控制层校验配置存在差异，服务层兜底也能保证不会再触发 Prisma 500。
  - 未改动接口契约：仍使用 `username/password` 字段，不引入破坏性变更。

### 3) 可复用资产（公共方法/脚本/skill/测试策略）
- 可复用方法：`AuthService.ensureAuthPayload(dto)`，适用于账号密码类入口参数的统一“非空+去空白”断言。
- 适用边界：仅用于账号密码认证入参，不负责密码复杂度策略、不负责验证码等外部校验链路。
- 禁用场景：不应替代 DTO 的结构化校验与文档注解；复杂规则应继续在 DTO/业务策略层实现。
- 测试策略：后续补充“用户名缺失/空白时返回 400”单测，作为认证模块回归基线。

### 4) Skill 与多 agent 记录
- skill 调用：本次未调用。
- 未调用原因：问题定位与修复范围集中在单个服务文件，现有项目规范已覆盖，使用 skill 的收益低于上下文开销。
- 多 agent 决策：未启用多 agent。
- 原因：单文件小范围修复，无并行价值，单 agent 可更快闭环并降低 token 成本。
