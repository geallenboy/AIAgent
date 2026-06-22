# Agent Team 项目介绍

这份文档帮助第一次接触 Agent Team 的人快速理解：它是什么、为什么这样设计、怎么使用、能解决哪些场景，以及如何继续维护和扩展。

## 1. 这是什么

Agent Team 是一个 Codex-first 的本地 AI 员工团队系统。它不是先做一个重型 SaaS 或复杂后台，而是把“员工、技能、团队、任务、工作流”定义成 Codex 可以读取、调度和执行的本地文件。

你可以把它理解为一个轻量本地 AI Agency：

- 用户只需要描述目标，例如“帮我规划一个 MVP”或“审查这次代码变更”。
- Codex 根据本地 registry 选择合适团队和 workflow。
- 每个 workflow 把任务拆成多个 step，每个 step 绑定一个 AI 员工和一种技能方法。
- 运行过程会生成 step prompt、产出物和事件日志，便于追踪和复盘。

这个项目适合个人 AI 使用者、独立开发者、产品/工程/增长/运营负责人，用来把复杂任务拆给多个专业 AI 角色协作。

## 2. 设计理念

Agent Team 的设计目标是“轻量、可读、可执行、可迁移”。

- **轻量文件注册表**：员工、技能、团队和工作流都放在本地 Markdown/YAML 文件里，便于阅读、版本管理和快速修改。
- **Codex-first**：默认让 Codex 读取 registry、执行 step、提交产出，而不是要求用户手动复制多个提示词。
- **中文可维护**：文件名、id、workflow 引用保持英文，正文说明、职责、任务和交付格式尽量中文化。
- **按能力域拆分**：用 division 管理产品、工程、设计、增长、质量、支持、财务等能力，避免一个巨大提示词包办所有事情。
- **可迁移到 orchestrator**：workflow 使用 `depends_on`、`output` 等结构，保留未来迁移到更完整 Agency Orchestrator 或 YAML 引擎的空间。

## 3. 核心对象

| 对象 | 含义 | 例子 | 存放位置或运行位置 |
| --- | --- | --- | --- |
| Division | 能力部门，用来组织员工、团队和工作流 | Product、Engineering、Marketing、Finance | `agent-team/agency/divisions` |
| Employee | AI 员工角色，定义职责、输入、输出、工具和交接对象 | `product-manager`、`frontend-developer`、`qa-reviewer` | `agent-team/employees` |
| Skill | 员工执行任务时使用的方法说明 | 需求分析、架构评审、API 测试、财务预测 | `agent-team/skills` |
| Team | 多个员工组成的可调用团队 | `full-stack-agency`、`testing-agency` | `agent-team/teams` |
| Workflow | 可执行步骤图，规定谁先做、产出什么、谁接着处理 | `new-product-mvp`、`pr-code-review` | `agent-team/workflows` |
| Run | 某次 workflow 的运行实例 | 一次 MVP 规划 run、一次上线检查 run | `.agent-team/runtime` |
| Approval | 对敏感能力的审批机制 | 写文件、执行命令、联网、提交 git、发布外部内容 | runtime step 状态和事件日志 |

## 4. 当前能力总览

截至本次本地校验，Agent Team registry 规模如下：

| 类型 | 数量 |
| --- | ---: |
| Divisions | 15 |
| Employees | 130 |
| Skills | 62 |
| Teams | 18 |
| Workflows | 28 |

当前 18 个团队及适用场景：

| 团队 | 适用场景 |
| --- | --- |
| `product-development-squad` | 新产品、MVP、PRD、功能设计、开发任务拆解 |
| `product-strategy-agency` | 产品机会、用户反馈、路线图、sprint 优先级、行为设计 |
| `full-stack-agency` | 产品、UX、前后端、安全、测试的完整交付计划 |
| `design-specialist-agency` | UX、UI、品牌、视觉叙事、AI 图片提示词、可访问性 |
| `engineering-specialist-agency` | 复杂工程专项、代码库理解、AI/数据/移动/SRE/平台集成 |
| `project-management-agency` | 项目计划、里程碑、实验追踪、issue workflow、交付节奏 |
| `testing-agency` | 测试结果、性能、API、工具评估、工作流优化、可访问性 |
| `code-review-squad` | PR/代码审查、安全、性能、架构和测试风险 |
| `evidence-quality-agency` | 证据、现实性、未验证假设、合规和质量复核 |
| `production-readiness-agency` | 上线前 Go/No-Go、监控、回滚、安全和合规复核 |
| `growth-analysis-squad` | 市场机会、商业分析、增长方向判断 |
| `launch-growth-agency` | 发布定位、文案、增长实验、指标和复盘 |
| `marketing-agency` | SEO/AEO、自然增长、社媒、社区、中国市场、App Store |
| `paid-media-agency` | PPC、付费社交、程序化广告、创意测试、转化跟踪和账户审计 |
| `finance-agency` | 账务、财务分析、预算预测、现金流、投资研究和税务准备 |
| `support-agency` | 用户工单、FAQ、支持分类、运营摘要、基础设施和财务跟踪 |
| `spatial-computing-agency` | visionOS、XR、空间 UI、沉浸式场景、Metal/3D、空间 cockpit |
| `specialized-agency` | MCP/tooling、专业 intake、文档审查、合规审计、模型 QA |

## 5. 如何使用

### 自然语言触发

最简单的方式是在 Codex 中直接说：

```text
用 Agent Team 帮我规划一个 AI 记账工具 MVP
```

如果你不确定该选哪个团队，就让 Agent Team 自动路由：

```text
用 Agent Team 处理下面这个任务，并先告诉我你选择了哪个团队和原因：
我想把 AI 记账工具做成两周内可上线的 MVP，还想知道发布后怎么找第一批用户。
```

### 指定团队

当你知道任务类型时，可以直接指定团队：

```text
用 Engineering Specialist Agency 分析这个工程任务需要哪些专家，并输出实现、可靠性、安全和文档交接计划。
```

### 指定 workflow

配置 MCP 后，可以用 `$agent-team` 指定 workflow：

```text
$agent-team 用 new-product-mvp 规划一个 AI 记账工具 MVP
```

常用 workflow 包括：

- `new-product-mvp`
- `feature-to-dev-tasks`
- `full-stack-product-pipeline`
- `pr-code-review`
- `evidence-quality-review`
- `production-readiness-review`
- `marketing-campaign-plan`
- `paid-media-campaign-plan`
- `finance-operating-review`
- `support-ticket-triage`
- `mcp-workflow-design`

### CLI 和 Workbench

在项目根目录可使用：

```bash
npm run validate
npm run mcp
node src/agent-team/cli.js serve
```

- `npm run validate`：校验 registry 结构、引用、依赖和输出变量。
- `npm run mcp`：启动 Agent Team MCP server。
- `node src/agent-team/cli.js serve`：启动本地 Web Workbench，用于查看 registry、run、step、approval 和 events。

## 6. 常见场景

### 从想法到 MVP

```text
用产品开发小队帮我规划一个 AI 记账工具 MVP。
目标用户：记账坚持不下来、但想知道钱花到哪里的人。
约束：第一版只做 Web App，不接银行账户，不做投资建议。
请输出：目标用户、核心场景、MVP 范围、不做范围、验收标准、开发顺序。
```

### 功能拆解

```text
用产品开发小队把“用户输入一句话，AI 自动拆成多笔账目”拆成开发任务。
请输出：功能目标、用户故事、数据结构、接口、前端状态、测试用例、任务顺序。
```

### 完整产品交付

```text
用 Full Stack Agency 帮我把 AI 记账工具拆成完整交付计划。
请覆盖：产品目标、用户路径、页面结构、前端状态、后端 API、数据模型、安全隐私、测试计划、交付里程碑。
```

### 代码审查

```text
用代码审查小队审查当前代码变更。
请重点检查：结构是否清晰、引用是否正确、测试是否足够、是否有维护风险。
输出按严重程度排序：P0/P1/P2 findings、测试缺口、剩余风险。
```

### 测试和上线检查

```text
用 Production Readiness Agency 做上线前 Go/No-Go 检查。
发布范围：自然语言记账、账目列表、分类编辑、月度总结、预算提醒。
已知限制：暂不支持银行账户同步，AI 结果需要用户确认。
请输出：发布检查表、阻塞项、可接受风险、监控项、回滚计划、Go/No-Go 建议。
```

### 增长、营销和广告

```text
用 Marketing Agency 帮我设计 AI 记账工具自然增长计划。
目标用户：自由职业者、学生、轻度理财用户。
目标市场：美国和中国。
请输出：渠道优先级、SEO/AEO 内容集群、AI citation 机会、社媒策略、App Store 优化、指标和 30 天执行计划。
```

### 财务、支持和专业流程

```text
用 Support Agency 处理这条用户工单：
“我上传了小票，但 AI 识别错了金额，还把餐饮分到了购物。我想知道你们会不会保存我的小票图片？”
产品：AI 记账工具。
请输出：问题分类、建议回复、需要用户补充的信息、是否升级到产品/工程/合规、FAQ 建议。
```

### MCP 工具设计

```text
用 Specialized Agency 帮我设计一个 MCP 工具和跨系统 workflow。
目标：AI 可以查询 CRM 客户信息、读取最近支持工单、生成一页客户摘要，并在退款/法律/医疗等高风险场景升级人工审批。
请输出：工作流、MCP tools/resources、输入输出 schema、权限、失败恢复、审计和合规风险。
```

## 7. 运行机制

Agent Team 推荐通过 MCP 执行，而不是手动解析所有 Markdown/YAML 文件。标准链路是：

```text
list_workflows -> describe_workflow -> create_run -> get_next_action -> submit_step_output
```

运行时会发生这些事情：

- `list_workflows` 返回当前可用 workflow、所属 team、输入字段和 step 数量。
- `describe_workflow` 查看某个 workflow 的完整步骤、依赖和输入要求。
- `create_run` 创建一次运行实例，并写入 `.agent-team/runtime`。
- `get_next_action` 判断下一步是执行 step、等待审批、等待依赖，还是总结完成结果。
- 每个 ready step 会生成一份 step prompt，包含员工职责、技能方法、当前任务和预期输出。
- step output 提交后会保存为 artifact，并把该 step 标记为 succeeded。
- events 记录 run 创建、step ready、审批、输出提交、成功、取消等审计信息。
- 如果 step 依赖前置输出，runtime 会把前置 step 的 output 注入后续 prompt 变量。

Web Workbench 会读取同一份 runtime 状态，因此可以用浏览器查看 run、DAG、step prompt、artifact、approval 和 event log。

## 8. 安全与边界

Agent Team 是一个调度和执行辅助系统，不会替用户假装完成外部动作。

需要重点遵守这些边界：

- 没有真实运行命令或检查文件时，不声称“已验证”。
- 涉及写文件、执行命令、网络访问、git 写操作、密钥处理、外部发布等能力时，应进入审批或明确授权流程。
- 不在输出、日志、文档或提交信息中暴露 API Key、Token、密码、私钥、Cookie、Session、数据库连接串等敏感信息。
- 示例统一使用 `YOUR_API_KEY`、`<TOKEN>`、`<DATABASE_URL>` 等占位符。
- 法律、医疗、金融、税务等高风险领域只做 intake、信息整理和风险提示，不提供正式专业意见。
- 员工不是独立账号，也不能绕过 Codex 当前工具、权限和沙箱约束。

## 9. 维护和扩展

新增或修改 Agent Team 内容时，优先按 division 放到对应目录：

```text
agent-team/
  employees/<division>/
  skills/<division>/
  teams/<division>/
  workflows/<division>/
```

基本维护方式：

- 新增 employee：在 `agent-team/employees/<division>` 增加 Markdown 员工档案，保持 frontmatter 字段完整。
- 新增 skill：在 `agent-team/skills/<division>` 增加 Markdown 方法说明。
- 新增 team：在 `agent-team/teams/<division>` 增加 YAML 团队配置，并引用真实 employee。
- 新增 workflow：在 `agent-team/workflows/<division>` 增加 YAML 步骤图，并确保 team、employee、skill、depends_on、output 都可校验。
- 修改后运行 `npm run validate` 和 `npm test`。
- 如果 registry 数量变化，同步更新本文档和模块总览中的统计数字。

## 10. 快速选择表

| 用户目标 | 推荐团队 | 推荐 workflow | 示例提示词 |
| --- | --- | --- | --- |
| 从想法到 MVP | `product-development-squad` | `new-product-mvp` | 用产品开发小队规划一个 AI 记账工具 MVP |
| 把功能拆成开发任务 | `product-development-squad` | `feature-to-dev-tasks` | 用产品开发小队把会员功能拆成开发任务 |
| 做完整产品交付计划 | `full-stack-agency` | `full-stack-product-pipeline` | 用 Full Stack Agency 把产品、设计、工程、测试拆成交付计划 |
| 分析反馈和排优先级 | `product-strategy-agency` | `product-discovery-and-prioritization` | 用 Product Strategy Agency 分析用户反馈和 backlog |
| 规划复杂工程专项 | `engineering-specialist-agency` | `engineering-specialist-routing` | 用 Engineering Specialist Agency 路由这个工程任务 |
| 设计 UX/UI/品牌体验 | `design-specialist-agency` | `design-specialist-routing` | 用 Design Specialist Agency 设计第一版产品体验 |
| 制定项目交付计划 | `project-management-agency` | `project-delivery-plan` | 用 Project Management Agency 制定 6 周交付计划 |
| 分析测试质量 | `testing-agency` | `testing-quality-review` | 用 Testing Agency 分析当前测试输出和质量缺口 |
| 审查代码或 PR | `code-review-squad` | `pr-code-review` | 用代码审查小队审查当前代码变更 |
| 复核方案可信度 | `evidence-quality-agency` | `evidence-quality-review` | 用 Evidence Quality Agency 检查方案是否可信 |
| 做上线前检查 | `production-readiness-agency` | `production-readiness-review` | 用 Production Readiness Agency 做上线前 Go/No-Go |
| 做自然增长计划 | `marketing-agency` | `marketing-campaign-plan` | 用 Marketing Agency 设计自然增长计划 |
| 做中国市场增长 | `marketing-agency` | `china-market-growth-plan` | 用 Marketing Agency 设计中国市场增长计划 |
| 做发布增长 | `launch-growth-agency` | `go-to-market-launch` | 用 Launch Growth Agency 设计发布定位和增长实验 |
| 做付费广告投放 | `paid-media-agency` | `paid-media-campaign-plan` | 用 Paid Media Agency 设计首月广告投放计划 |
| 做广告账户审计 | `paid-media-agency` | `paid-media-account-audit` | 用 Paid Media Agency 审计广告账户数据 |
| 做财务运营分析 | `finance-agency` | `finance-operating-review` | 用 Finance Agency 分析预算、现金流和 runway |
| 做投资/税务准备分析 | `finance-agency` | `finance-investment-tax-review` | 用 Finance Agency 整理投资研究和税务准备问题 |
| 处理用户工单 | `support-agency` | `support-ticket-triage` | 用 Support Agency 处理这条用户工单 |
| 生成运营摘要 | `support-agency` | `support-ops-summary` | 用 Support Agency 生成本周运营摘要 |
| 规划 visionOS/XR 产品 | `spatial-computing-agency` | `spatial-product-design` | 用 Spatial Computing Agency 规划空间产品 |
| 规划 visionOS 实现 | `spatial-computing-agency` | `visionos-implementation-plan` | 用 Spatial Computing Agency 输出 visionOS 实现计划 |
| 设计 MCP 工具工作流 | `specialized-agency` | `mcp-workflow-design` | 用 Specialized Agency 设计 MCP 工具和跨系统 workflow |
| 做模型或 agent QA | `specialized-agency` | `model-qa-review` | 用 Specialized Agency 对这个 agent 输出做 Model QA |
| 做专业领域 intake | `specialized-agency` | `specialized-domain-intake` | 用 Specialized Agency 处理法律/医疗/金融等专业 intake |
| 分析开源项目 | `specialized-agency` | `open-source-project-analysis` | 用 Specialized Agency 分析这个 GitHub 开源项目 |
| 优化测试/发布流程 | `testing-agency` | `testing-workflow-optimization` | 用 Testing Agency 优化当前测试和发布工作流 |
| 审查 studio 运行方式 | `project-management-agency` | `studio-operations-review` | 用 Project Management Agency 审查当前 studio 流程 |
| 自动选择团队 | Agent Team 自动路由 | 由 Codex 选择 | 用 Agent Team 处理下面这个任务，并说明选择哪个团队和原因 |
