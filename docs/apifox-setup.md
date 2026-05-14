# Apifox 接入说明（全自动同步）

## 目标
通过 Swagger 导出的 OpenAPI 规范，让 Apifox 承担联调、调试和团队协作，并实现自动同步。

## 一次性准备
1. 在 Apifox 或团队网关中创建 OpenAPI 导入接口地址（URL）。
2. 获取该导入地址所需鉴权信息（若需要 Token）。
3. 确认本地可生成 OpenAPI：`npm run docs:openapi`。

## 本地全自动同步
1. 设置环境变量：
   - `export APIFOX_IMPORT_URL="<你的Apifox导入URL>"`
   - `export APIFOX_TOKEN="<可选，若导入接口需要鉴权>"`
2. 执行同步：
   - `npm run apifox:sync`

脚本会自动完成：
- 导出 `docs/openapi.json`
- 调用 `APIFOX_IMPORT_URL` 提交最新 OpenAPI 文档

## GitHub Actions 自动同步（推荐）
工作流文件：`.github/workflows/apifox-sync.yml`

### 触发条件
- `push` 到 `main`
- `workflow_dispatch` 手动触发

### 必要 Secrets
- `APIFOX_IMPORT_URL`（必填）
- `APIFOX_TOKEN`（可选）

### 执行步骤
1. `npm ci`
2. `npm run build`
3. `npm test`
4. `npm run apifox:sync`

### 保护策略
- `build/test` 失败时，阻止同步，避免坏契约进入 Apifox。
- 使用 `concurrency` 避免并发 push 重复覆盖同步。

## 失败排查
- 缺少 `APIFOX_IMPORT_URL`
  - 现象：工作流报错 `Missing required secret APIFOX_IMPORT_URL`
  - 处理：补充仓库 Secrets
- 导入鉴权失败（401/403）
  - 处理：检查 `APIFOX_TOKEN` 是否过期、权限是否正确
- 导入地址不可达
  - 处理：验证 URL、网络连通性、域名解析
- 测试失败导致未同步
  - 处理：先修复测试，再重新触发 `workflow_dispatch`

## 说明
- 当前项目 OpenAPI 规范文件默认路径：`docs/openapi.json`
- 如需修改导出位置，可设置：`OPENAPI_OUTPUT_PATH`
- 如需修改同步读取文件，可设置：`OPENAPI_FILE`
