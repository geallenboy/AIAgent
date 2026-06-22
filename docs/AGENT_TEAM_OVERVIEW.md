# Developer Agent 项目介绍

这份文档帮助开发人员快速理解当前项目：它是什么、如何运行、能处理哪些开发场景，以及如何维护。

## 1. 这是什么

Developer Agent 是一个 Codex-first 的本地开发助手系统。它不是一个重型平台，而是把开发角色、方法和工作流定义成 Codex 可以读取、调度和执行的本地文件。

它服务的主链路是：

```text
需求或代码问题 -> 任务拆解 -> 架构/实现计划 -> 代码审查 -> 测试质量 -> 上线准备
```

## 2. 设计理念

- **开发人员优先**：只保留服务软件开发的角色、技能和 workflow。
- **本地可读**：registry 使用 Markdown/YAML，容易 review 和版本管理。
- **MCP 驱动**：优先通过 MCP 查询 workflow、创建 run、执行 step 和记录产出。
- **证据优先**：没有真实运行命令或检查文件时，不声称已验证。
- **安全边界明确**：写文件、执行命令、联网、git 写操作和外部发布都需要明确授权或审批。

## 3. 核心对象

| 对象 | 说明 | 例子 |
| --- | --- | --- |
| Division | 开发能力域 | Product、Engineering、Testing、Quality |
| Employee | 开发角色 | `architect`、`engineer`、`qa-reviewer` |
| Skill | 执行方法 | `architecture-review`、`implementation-planning` |
| Team | 可调用团队 | `code-review-squad`、`testing-agency` |
| Workflow | 可执行步骤图 | `pr-code-review`、`testing-quality-review` |
| Run | 一次 workflow 运行实例 | `.agent-team/runtime` 下的 run |
| Approval | 高风险能力审批 | 写文件、命令、网络、git、发布 |

## 4. 当前能力总览

当前 registry 规模：

| 类型 | 数量 |
| --- | ---: |
| Divisions | 6 |
| Employees | 47 |
| Skills | 21 |
| Teams | 7 |
| Workflows | 11 |

保留团队：

| 团队 | 适用场景 |
| --- | --- |
| `product-development-squad` | MVP 技术规划、功能拆解、验收标准 |
| `engineering-specialist-agency` | 复杂工程任务、代码库理解、AI/数据/可靠性/平台集成 |
| `code-review-squad` | PR、代码变更、架构变更和测试缺口审查 |
| `evidence-quality-agency` | 方案、实现或 AI 输出的证据和现实性复核 |
| `production-readiness-agency` | 构建、测试、安全、监控、回滚和发布建议 |
| `testing-agency` | 测试输出、API、性能、可访问性和流程质量 |
| `specialized-agency` | MCP/tooling、开源项目技术分析、模型/agent QA |

## 5. 如何使用

自然语言触发：

```text
用 Developer Agent 把这个功能拆成开发任务
```

指定 workflow：

```text
$agent-team 用 pr-code-review 审查当前代码变更
```

CLI：

```bash
npm run validate
npm run mcp
node src/agent-team/cli.js serve
```

## 6. 常见场景

- 功能拆解：把模糊功能变成开发任务、接口/数据流、测试场景和验收标准。
- 工程路由：判断需要哪些工程专家，并输出实现、风险和验证计划。
- 代码审查：按严重程度输出 findings、测试缺口和剩余风险。
- 测试质量：分析测试输出、API 覆盖、性能风险和可访问性问题。
- 上线准备：检查构建、回归、安全、监控、回滚和 Go/No-Go。
- MCP/tooling：设计工具 schema、权限、失败恢复和审计方式。
- 开源分析：理解 GitHub 项目技术定位、架构、集成成本和采用风险。

## 7. 运行机制

标准 MCP 链路：

```text
list_workflows -> describe_workflow -> create_run -> get_next_action -> submit_step_output
```

运行结果写入 `.agent-team/runtime`。每个 step 会生成 prompt，提交后保存 artifact，并通过 events 记录 ready、approval、output、succeeded、cancelled 等状态。

## 8. 安全与边界

- 不编造验证结果。
- 不输出真实凭据或用户隐私数据。
- 高风险能力必须经过授权或审批。
- 高风险专业结论只做工程风险提示，不提供正式专业意见。

## 9. 维护和扩展

新增内容时放到对应目录：

```text
agent-team/
  employees/<division>/
  skills/<division>/
  teams/<division>/
  workflows/<division>/
```

每次修改后运行：

```bash
npm run validate
npm test
```

## 10. 快速选择表

| 用户目标 | 推荐 workflow |
| --- | --- |
| 从想法到 MVP 技术计划 | `new-product-mvp` |
| 把功能拆成开发任务 | `feature-to-dev-tasks` |
| 分析复杂工程任务 | `engineering-specialist-routing` |
| 审查代码或 PR | `pr-code-review` |
| 复核方案可信度 | `evidence-quality-review` |
| 做上线前检查 | `production-readiness-review` |
| 分析测试质量 | `testing-quality-review` |
| 优化测试或发布流程 | `testing-workflow-optimization` |
| 设计 MCP 工具或开发工作流 | `mcp-workflow-design` |
| 做模型或 agent QA | `model-qa-review` |
| 分析开源项目 | `open-source-project-analysis` |
