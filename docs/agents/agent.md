# agent.md

## Purpose
记录任务级实现决策、接口规范、踩坑与复用结论，避免重复分析消耗。

## Rules
- 单对象操作接口统一使用 `id`。
- 多 ID 并存时使用语义字段（如 `resourceId`、`parserSourceId`）。
- 禁止路径参数，统一 query/body 传参。
- PostgreSQL（bgsql）所有业务表与字段必须有中文注释；迁移脚本中使用 `COMMENT ON TABLE/COLUMN` 同步维护。
