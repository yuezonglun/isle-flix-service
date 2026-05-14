# isle-flix-service

视频资源聚合后端服务（V1），技术栈：NestJS + Prisma + PostgreSQL。

## 项目规范
- 禁止使用路径参数（no path params）。
- 单对象查询/操作统一只使用 `id` 参数。
- 多个 ID 同时出现时，使用语义化字段（如 `resourceId`、`episodeId`、`parserSourceId`）。
- 关键业务逻辑必须使用中文注释。
- 接口文档全部使用中文描述。

## 环境准备
1. 复制环境变量文件：
   - `cp .env.example .env`
2. 配置数据库连接（`.env`）：
   - `DATABASE_URL="postgresql://up3d:123456@localhost:5432/isle_flix?schema=public"`

## 常用命令
- 安装依赖：`npm install`
- 开发模式启动：`npm run dev`
- 项目打包：`npm run build`
- 运行打包产物：`npm run start`
- 执行测试：`npm test`
- 生成 Prisma Client：`npm run prisma:generate`
- 执行 Prisma 迁移：`npm run prisma:migrate`
- 导出 OpenAPI 文件：`npm run docs:openapi`
- 自动同步到 Apifox：`npm run apifox:sync`

## Swagger 文档
- 在线文档：`GET /docs`
- OpenAPI JSON：`GET /docs-json`
- 鉴权方式：Bearer Token（先调用 `POST /auth/login` 获取 `accessToken`）

## Apifox 全自动同步（GitHub Actions）

### 1. 配置 GitHub Secrets
在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions` 中新增：
- `APIFOX_IMPORT_URL`（必填）：Apifox/OpenAPI 导入接口地址
- `APIFOX_TOKEN`（可选）：如果导入接口需要鉴权则填写

### 2. 自动触发策略
工作流文件：`.github/workflows/apifox-sync.yml`
- `push` 到 `main` 自动执行
- 支持 `workflow_dispatch` 手动触发

### 3. 流程顺序
1. `npm ci`
2. `npm run build`
3. `npm test`
4. `npm run apifox:sync`

> 说明：`build` 或 `test` 任一步失败，Apifox 同步不会执行。

## 本地手动同步（可选）
1. 设置环境变量：
   - `export APIFOX_IMPORT_URL="<你的Apifox导入URL>"`
   - `export APIFOX_TOKEN="<可选，若导入接口需要鉴权>"`
2. 一键同步：
   - `npm run apifox:sync`

## 常见失败排查
- `Missing required secret APIFOX_IMPORT_URL`
  - 原因：GitHub Secrets 未配置
  - 处理：在仓库 Secrets 中补充 `APIFOX_IMPORT_URL`
- `401/403` 鉴权失败
  - 原因：`APIFOX_TOKEN` 无效或缺失
  - 处理：更新 Token 或确认导入地址鉴权方式
- `curl: (6) Could not resolve host`
  - 原因：CI 网络或导入域名不可达
  - 处理：检查导入 URL、DNS、网络策略
- `npm run test` 失败导致未同步
  - 原因：契约/单测失败
  - 处理：先修复测试，再重新触发工作流

## 接口示例
- `POST /auth/login`
- `GET /resource-detail?id=...`
- `GET /resource-episodes?id=...`
- `GET /crawl-job/detail?id=...`
- `POST /parser-source/update`，请求体：`{ id, ... }`
- `POST /user-parser-source/toggle`，请求体：`{ id, enabled }`
- `POST /knowledge/agent-note/detail`，请求体：`{ id }`
- `POST /resolve`，请求体：`{ resourceId?, episodeId?, parserSourceId, targetUrl }`
