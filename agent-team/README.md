# Developer Agent Registry

这个目录定义 Developer Agent 的本地 registry。Codex 通过这里的员工、技能、团队和 workflow 来处理开发任务。

## 核心概念

- **Employee**：开发角色，例如架构师、工程师、测试分析师、DevOps、安全工程师。
- **Division**：能力域，目前保留 Product、Engineering、Testing、Quality、Specialized、Project Management。
- **Skill**：执行方法，例如需求拆解、架构评审、实现规划、API 测试、发布准备。
- **Team**：可调用团队，例如 `engineering-specialist-agency`、`code-review-squad`、`testing-agency`。
- **Workflow**：可执行步骤图，使用 `depends_on` 和 `output` 串联上下文。

## 推荐路径

- 功能想法拆开发任务：`product-development-squad` + `feature-to-dev-tasks`
- 新项目/MVP 技术规划：`product-development-squad` + `new-product-mvp`
- 复杂工程任务路由：`engineering-specialist-agency` + `engineering-specialist-routing`
- 代码审查：`code-review-squad` + `pr-code-review`
- 测试质量分析：`testing-agency` + `testing-quality-review`
- 上线前检查：`production-readiness-agency` + `production-readiness-review`
- MCP/tooling 设计：`specialized-agency` + `mcp-workflow-design`
- 模型或 agent QA：`specialized-agency` + `model-qa-review`

## 默认输出格式

1. 背景理解
2. 开发分工
3. 决策建议
4. 风险/疑问
5. 下一步行动

## 维护约定

- 文件名和 `id` 使用英文短横线格式。
- 正文说明、职责和任务说明可以使用中文，方便日常维护。
- 删除或新增 registry 文件后运行 `npm run validate`。
- workflow 只能引用当前存在的 employee、skill、team 和前置 output。
