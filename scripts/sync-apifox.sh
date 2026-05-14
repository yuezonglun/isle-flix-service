#!/usr/bin/env bash
set -euo pipefail

# 必填：Apifox OpenAPI 导入地址（由你在 Apifox/OpenAPI 平台创建并提供）
: "${APIFOX_IMPORT_URL:?请先设置 APIFOX_IMPORT_URL}"

# 可选：Apifox 鉴权 Token（如你的导入地址要求鉴权）
APIFOX_TOKEN="${APIFOX_TOKEN:-}"

# 可选：导出的 OpenAPI 文件路径
OPENAPI_FILE="${OPENAPI_FILE:-docs/openapi.json}"

# 1) 先生成本地 OpenAPI JSON
npm run docs:openapi

if [[ ! -f "$OPENAPI_FILE" ]]; then
  echo "未找到 OpenAPI 文件: $OPENAPI_FILE"
  exit 1
fi

# 2) 调用 Apifox 导入接口
# 说明：不同团队的导入网关路径可能不同，因此通过 APIFOX_IMPORT_URL 外置。
if [[ -n "$APIFOX_TOKEN" ]]; then
  curl -sS -X POST "$APIFOX_IMPORT_URL" \
    -H "Authorization: Bearer $APIFOX_TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "@$OPENAPI_FILE"
else
  curl -sS -X POST "$APIFOX_IMPORT_URL" \
    -H "Content-Type: application/json" \
    --data-binary "@$OPENAPI_FILE"
fi

echo "Apifox 自动同步完成。"
