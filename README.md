# Codex-First Developer Agent

这是一个面向开发人员的本地 Developer Agent 工作区。它把“员工、技能、团队、任务、工作流”定义为 Codex 可以读取和执行的本地文件，用来完成从需求拆解、架构设计、实现计划、代码审查、测试质量到上线准备的开发闭环。

## 快速使用

1. 第一次了解项目，先读 [docs/AGENT_TEAM_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/AGENT_TEAM_OVERVIEW.md)。
2. 想直接上手，读 [docs/USER_GUIDE.md](/Users/gegarron/Documents/AI Agent/docs/USER_GUIDE.md)。
3. 想看模块和 workflow 总览，读 [docs/MODULES_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/MODULES_OVERVIEW.md)。
4. 需要可复制提示词，读 [docs/EXAMPLES.md](/Users/gegarron/Documents/AI Agent/docs/EXAMPLES.md)。
5. 在对话里直接说你的开发任务，例如：
   - “用 Developer Agent 把这个功能拆成开发任务”
   - “用 Engineering Specialist Agency 分析这个工程任务”
   - “用代码审查小队审查当前变更”
   - “用 Testing Agency 分析测试输出和质量缺口”
   - “用 Production Readiness Agency 做上线前检查”
   - “用 Developer Tooling Agency 设计 MCP 工具”
   - “用 Developer Tooling Agency 分析这个 GitHub 开源项目”

Codex 会根据 [agent-team/teams](/Users/gegarron/Documents/AI Agent/agent-team/teams) 和 [agent-team/workflows](/Users/gegarron/Documents/AI Agent/agent-team/workflows) 选择团队、执行步骤并汇总输出。

## 在 Codex / Claude Code 中使用

这个项目提供 agent-native 入口：

- Codex Skill: [.agents/skills/agent-team/SKILL.md](/Users/gegarron/Documents/AI Agent/.agents/skills/agent-team/SKILL.md)
- Claude Code Skill: [.claude/skills/agent-team/SKILL.md](/Users/gegarron/Documents/AI Agent/.claude/skills/agent-team/SKILL.md)
- MCP server: `node src/agent-team/cli.js mcp`

Codex 配置示例见 [.codex/config.agent-team.example.toml](/Users/gegarron/Documents/AI Agent/.codex/config.agent-team.example.toml)。Claude Code 配置示例见 [.mcp.example.json](/Users/gegarron/Documents/AI Agent/.mcp.example.json)。

示例：

```text
$agent-team 用 pr-code-review 审查当前代码变更
```

```text
/agent-team 用 engineering-specialist-routing 分析这个工程任务
```

## 目录

- [agent-team/employees](/Users/gegarron/Documents/AI Agent/agent-team/employees)：开发相关 AI 员工档案。
- [agent-team/agency](/Users/gegarron/Documents/AI Agent/agent-team/agency)：Developer Agent 总组织和 division 路由。
- [agent-team/skills](/Users/gegarron/Documents/AI Agent/agent-team/skills)：开发工作可复用方法。
- [agent-team/teams](/Users/gegarron/Documents/AI Agent/agent-team/teams)：开发团队组合。
- [agent-team/tasks](/Users/gegarron/Documents/AI Agent/agent-team/tasks)：常见开发任务模板。
- [agent-team/workflows](/Users/gegarron/Documents/AI Agent/agent-team/workflows)：可执行 YAML 工作流。
- [src/agent-team](/Users/gegarron/Documents/AI Agent/src/agent-team)：registry、runtime、MCP server 和 Web Workbench。
- [test](/Users/gegarron/Documents/AI Agent/test)：runtime、registry、MCP 和 server 测试。

## 验证

```bash
npm run validate
npm test
```

当前 registry 规模：

```text
Employees: 47
Skills: 21
Teams: 7
Workflows: 11
Divisions: 6
```

## 维护约定

- 只保留服务开发闭环的角色、技能、团队和 workflow。
- 新增员工或 workflow 后必须运行 `npm run validate`。
- 涉及 runtime/MCP/server 行为时必须运行 `npm test`。
- 文档和示例应面向开发人员，不加入非开发业务场景。
