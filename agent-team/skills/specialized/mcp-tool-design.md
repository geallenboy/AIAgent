# Skill: MCP Tool Design

## 用途

设计 MCP tools/resources、输入输出 schema、权限、错误处理和审计。

## 输入

- 集成目标
- 外部系统
- 安全约束

## 方法

1. 定义 agent 需要完成的用户任务。
2. 将外部系统能力拆成最小工具。
3. 为每个工具定义 schema、权限、错误和审计。
4. 标记高风险或需要人工审批的动作。

## 输出

- Tool/resource 清单
- Schema
- Auth 和权限
- 风险

