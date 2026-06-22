# Codex-First Agent Team

这是一个给个人 AI 使用者准备的轻量 Agent Team 工作区。它不先开发重型应用，而是把“员工、技能、团队、任务、工作流”定义为 Codex 可以读取和执行的本地文件。

## 快速使用

1. 如果你是第一次了解 Agent Team，先读 [docs/AGENT_TEAM_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/AGENT_TEAM_OVERVIEW.md)。
2. 先读 [docs/USER_GUIDE.md](/Users/gegarron/Documents/AI Agent/docs/USER_GUIDE.md)，快速了解如何使用。
3. 想看完整模块、功能和案例总览时，打开 [docs/MODULES_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/MODULES_OVERVIEW.md)。
4. 需要可复制提示词时，打开 [docs/EXAMPLES.md](/Users/gegarron/Documents/AI Agent/docs/EXAMPLES.md)。
5. 想了解 Codex 内部执行规则时，读 [AGENTS.md](/Users/gegarron/Documents/AI Agent/AGENTS.md)。
6. 在对话里直接说你的任务，例如：
   - “用 Agent Team 帮我规划一个 AI 记账工具 MVP”
   - “用 Product Strategy Agency 分析反馈并排 sprint 优先级”
   - “用 Project Management Agency 制定项目交付计划”
   - “用 Design Specialist Agency 设计一个产品体验”
   - “用产品开发小队把会员功能拆成开发任务”
   - “用 Engineering Specialist Agency 路由一个复杂工程任务”
   - “用 Testing Agency 分析测试结果和优化测试流程”
   - “用 Support Agency 回复用户工单并生成运营摘要”
   - “用 Spatial Computing Agency 规划 visionOS/XR 产品”
   - “用 Specialized Agency 设计 MCP 工具或专业领域工作流”
   - “用 Marketing Agency 设计自然增长和内容计划”
   - “用 Paid Media Agency 设计广告投放计划”
   - “用 Finance Agency 做预算、现金流和税务准备分析”
   - “用代码审查小队做一次安全和性能评审”
7. Codex 会根据 [agent-team/teams](/Users/gegarron/Documents/AI Agent/agent-team/teams) 和 [agent-team/workflows](/Users/gegarron/Documents/AI Agent/agent-team/workflows) 选择团队、执行步骤、汇总输出。

## 在 Codex / Claude Code 中直接使用

这个项目提供 agent-native 入口：

- Codex Skill: [.agents/skills/agent-team/SKILL.md](/Users/gegarron/Documents/AI Agent/.agents/skills/agent-team/SKILL.md)
- Claude Code Skill: [.claude/skills/agent-team/SKILL.md](/Users/gegarron/Documents/AI Agent/.claude/skills/agent-team/SKILL.md)
- MCP server: `node src/agent-team/cli.js mcp`

Codex 配置示例见 [.codex/config.agent-team.example.toml](/Users/gegarron/Documents/AI Agent/.codex/config.agent-team.example.toml)。Claude Code 配置示例见 [.mcp.example.json](/Users/gegarron/Documents/AI Agent/.mcp.example.json)。

配置后可以在 agent 中直接说：

```text
$agent-team 用 new-product-mvp 规划一个 AI 记账工具 MVP
```

```text
/agent-team 用 pr-code-review 审查当前变更
```

Agent 会通过 MCP 查询 workflow、创建 run、读取 step prompt、提交 step output，并把状态写入 `.agent-team/runtime`。

## 目录

- [agent-team/employees](/Users/gegarron/Documents/AI Agent/agent-team/employees)：按 division 分组的 AI 员工档案。
- [agent-team/agency](/Users/gegarron/Documents/AI Agent/agent-team/agency)：Agency 总组织和 division 路由。
- [agent-team/skills](/Users/gegarron/Documents/AI Agent/agent-team/skills)：按 division 分组的可复用技能说明。
- [agent-team/teams](/Users/gegarron/Documents/AI Agent/agent-team/teams)：按 division 分组的团队组合。
- [agent-team/tasks](/Users/gegarron/Documents/AI Agent/agent-team/tasks)：常见任务模板。
- [agent-team/workflows](/Users/gegarron/Documents/AI Agent/agent-team/workflows)：按 division 分组、接近 Agency Orchestrator 风格的 YAML 工作流。
- [docs/AGENT_TEAM_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/AGENT_TEAM_OVERVIEW.md)：面向新用户的项目介绍、设计、使用方式、功能和场景总览。
- [docs/MODULES_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/MODULES_OVERVIEW.md)：模块、功能、团队和使用案例总览。
- [docs/USER_GUIDE.md](/Users/gegarron/Documents/AI Agent/docs/USER_GUIDE.md)：完整使用手册。
- [docs/EXAMPLES.md](/Users/gegarron/Documents/AI Agent/docs/EXAMPLES.md)：可复制提示词示例库。
- [scripts/validate-agent-team.mjs](/Users/gegarron/Documents/AI Agent/scripts/validate-agent-team.mjs)：本地结构校验脚本。

## 验证

```bash
npm test
npm run validate
```

校验会检查员工 frontmatter、团队成员引用、工作流步骤依赖、输出变量引用和必需目录。

## 维护约定

- 目录按 division 分组，方便继续从 `agency-agents` 补充角色。
- `id`、文件名和 workflow 引用保持英文，确保机器稳定引用。
- 面向用户的职责、行为准则、工作流任务和文档尽量中文化。
- 可以复用开源 agent 的结构和提示词思想，但应翻译、压缩并适配 Codex 本地执行方式。

## Agency 示例

更复杂的任务可以直接调用 Agency：

```text
用 Full Stack Agency 帮我把 AI 记账工具从产品、UX、前后端、安全和测试拆成完整交付计划。
```

```text
用 Evidence Quality Agency 检查这个产品方案是否可信，有哪些未验证假设。
```

```text
用 Production Readiness Agency 帮我做上线前 Go/No-Go 检查。
```
