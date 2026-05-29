# Codex-First Agent Team 使用手册

这份文档帮助你快速使用当前项目里的 AI Agency。你可以把它理解为一个“本地 AI 公司”：里面有员工、技能、团队、任务模板和工作流。你作为 AI 使用者，只需要描述目标，Codex 会按这里的规则调用合适的员工协作。

如果你想先看完整模块、功能和使用案例总览，读 [MODULES_OVERVIEW.md](/Users/gegarron/Documents/AI Agent/docs/MODULES_OVERVIEW.md)。

## 1. 一分钟上手

在这个项目目录中，直接对 Codex 说：

```text
用 Agent Team 帮我规划一个 AI 记账工具 MVP
```

或者更明确地指定团队：

```text
用 Full Stack Agency 帮我把 AI 记账工具从产品、UX、前后端、安全和测试拆成完整交付计划。
```

常用入口：

- 新产品/MVP：`用产品开发小队...`
- 完整产品交付：`用 Full Stack Agency...`
- 增长发布：`用 Launch Growth Agency...`
- 代码审查：`用代码审查小队...`
- 可信度检查：`用 Evidence Quality Agency...`
- 上线检查：`用 Production Readiness Agency...`

## 2. 核心概念

### Agency

Agency 是总组织，定义 division、默认调度者和跨团队协作原则。当前 Agency 配置在：

- [agent-team/agency/agency.yaml](/Users/gegarron/Documents/AI Agent/agent-team/agency/agency.yaml)

### Division

Division 是能力域。当前有 6 个：

| Division | 适合处理 |
| --- | --- |
| Strategy | 产品目标、需求、路线图、指标、商业判断 |
| Engineering | 架构、前端、后端、安全、DevOps |
| Design | 用户研究、体验路径、界面结构 |
| Growth | 市场、内容、渠道、增长实验 |
| Quality | QA、证据、现实性、安全、合规风险 |
| Operations | 任务编排、自动化、交付节奏、复盘 |

### Employee

Employee 是 AI 员工角色。例如：

- `agency-orchestrator`：总调度者
- `product-manager`：产品经理
- `architect`：架构师
- `frontend-developer`：前端工程师
- `backend-architect`：后端架构师
- `qa-reviewer`：质量审查
- `reality-checker`：现实性检查

员工文件按 division 分组，例如：

- [agent-team/employees](/Users/gegarron/Documents/AI Agent/agent-team/employees)
- `employees/engineering`
- `employees/design`
- `employees/paid-media`
- `employees/quality`

### Skill

Skill 是可复用方法。例如需求分析、架构评审、增长实验、安全审查。

技能文件也按 division 分组：

- [agent-team/skills](/Users/gegarron/Documents/AI Agent/agent-team/skills)

### Team

Team 是员工组合。例如：

- `product-development-squad`
- `full-stack-agency`
- `launch-growth-agency`
- `code-review-squad`

团队文件按 division 分组：

- [agent-team/teams](/Users/gegarron/Documents/AI Agent/agent-team/teams)

### Workflow

Workflow 是可执行步骤图。它用 `steps`、`depends_on`、`output` 把员工输出串起来。

工作流文件按 division 分组：

- [agent-team/workflows](/Users/gegarron/Documents/AI Agent/agent-team/workflows)

## 3. 如何选择团队

如果你不确定选哪个团队，直接说“用 Agent Team”，Codex 会根据 [AGENTS.md](/Users/gegarron/Documents/AI Agent/AGENTS.md) 自动路由。

| 你的目标 | 推荐团队 | 推荐说法 |
| --- | --- | --- |
| 从想法到 MVP | `product-development-squad` | 用产品开发小队规划一个...MVP |
| 产品机会、反馈、路线图、优先级 | `product-strategy-agency` | 用 Product Strategy Agency 分析... |
| 项目计划、实验追踪、issue 流程 | `project-management-agency` | 用 Project Management Agency 制定... |
| 产品、设计、工程、质量全链路 | `full-stack-agency` | 用 Full Stack Agency 把...拆成完整交付计划 |
| UX/UI/品牌/视觉专项 | `design-specialist-agency` | 用 Design Specialist Agency 设计...体验 |
| 复杂工程专项 | `engineering-specialist-agency` | 用 Engineering Specialist Agency 路由这个工程任务 |
| 拆开发任务 | `product-development-squad` | 用产品开发小队把...拆成开发任务 |
| 代码/PR 审查 | `code-review-squad` | 用代码审查小队审查当前变更 |
| 测试结果、性能、API、工具、工作流 | `testing-agency` | 用 Testing Agency 分析... |
| 客户支持、财务、基础设施、摘要 | `support-agency` | 用 Support Agency 处理... |
| visionOS/XR/空间 UI/沉浸式体验 | `spatial-computing-agency` | 用 Spatial Computing Agency 规划... |
| MCP、专业 intake、文档、模型 QA | `specialized-agency` | 用 Specialized Agency 处理... |
| 增长、发布、文案、指标 | `launch-growth-agency` | 用 Launch Growth Agency 设计...发布计划 |
| 自然增长、SEO/AEO、社媒、社区 | `marketing-agency` | 用 Marketing Agency 设计...增长计划 |
| 付费广告投放和账户审计 | `paid-media-agency` | 用 Paid Media Agency 设计...广告投放计划 |
| 账务、财务分析、预算、投资/税务准备 | `finance-agency` | 用 Finance Agency 分析... |
| 市场/商业分析 | `growth-analysis-squad` | 用增长分析小队分析...市场机会 |
| 可信度、证据、风险复核 | `evidence-quality-agency` | 用 Evidence Quality Agency 检查...是否可信 |
| 上线前检查 | `production-readiness-agency` | 用 Production Readiness Agency 做 Go/No-Go 检查 |

## 4. 当前团队说明

### product-development-squad

适合：新产品、MVP、PRD、功能设计、开发任务拆解。

典型输出：

- 需求摘要
- MVP 范围
- 技术方案
- 开发任务
- 测试与验收计划

示例：

```text
用产品开发小队帮我规划一个 AI 记账工具 MVP，目标用户是记账坚持不下来的人。
```

### product-strategy-agency

适合：产品机会发现、趋势研究、用户反馈综合、路线图、sprint 优先级、激活和留存行为设计。

典型输出：

- 产品机会
- 用户反馈洞察
- 趋势和市场假设
- sprint 优先级
- 行为设计和指标

示例：

```text
用 Product Strategy Agency 分析 AI 记账工具的用户反馈、趋势和 backlog，帮我排下一轮 sprint 优先级。
```

### project-management-agency

适合：复杂项目计划、跨团队交付、studio 生产管理、长期项目推进、实验追踪、Jira/Linear/GitHub Issues 工作流治理。

典型输出：

- 项目计划
- 里程碑和依赖
- 生产和评审节奏
- 实验台账
- 工作流治理建议

示例：

```text
用 Project Management Agency 帮我为 AI 记账工具制定 6 周交付计划，包含里程碑、production board、实验追踪和 GitHub Issues 工作流。
```

### full-stack-agency

适合：复杂产品或功能，需要产品、UX、UI、前端、后端、安全、质量一起参与。

典型输出：

- 任务路由
- 产品规格
- UX/UI 方案
- 技术方案
- 安全与测试计划
- 交付路线图

示例：

```text
用 Full Stack Agency 帮我把 AI 记账工具从产品、UX、前后端、安全和测试拆成完整交付计划。
```

### design-specialist-agency

适合：UX 架构、UI 设计、品牌一致性、视觉叙事、AI 图片提示词、可访问性审查和微交互。

典型输出：

- 设计任务分类
- UX 架构
- UI 和组件建议
- 品牌与视觉叙事
- 可访问性和愉悦细节审查

示例：

```text
用 Design Specialist Agency 帮我设计 AI 记账工具的第一版体验，覆盖 UX、UI、品牌、视觉素材、可访问性和微交互。
```

### engineering-specialist-agency

适合：复杂工程专项、代码库理解、AI/数据/移动/可靠性/平台集成、性能和文档任务。

典型输出：

- 工程任务分类
- specialist 分工
- 技术方案
- 风险和质量门
- 验证计划

示例：

```text
用 Engineering Specialist Agency 帮我分析这个工程任务需要哪些专家，并输出实现、可靠性、安全和文档交接计划。
```

### launch-growth-agency

适合：发布定位、增长实验、落地页文案、内容计划、指标复盘。

典型输出：

- 定位和目标用户
- 增长实验
- 发布文案
- 指标方案
- 复盘计划

示例：

```text
用 Launch Growth Agency 帮我设计 AI 记账工具的发布定位、核心文案、增长实验和指标。
```

### marketing-agency

适合：自然增长、SEO/AEO、AI citation、社媒内容、社区运营、App Store 优化、中国市场本地化、小红书/抖音/微信/知乎/B 站等平台策略。

典型输出：

- 渠道策略
- 内容计划
- SEO/AEO 和引用策略
- 平台专项方案
- 指标和复盘计划

示例：

```text
用 Marketing Agency 帮我设计 AI 记账工具的自然增长计划，覆盖 SEO/AEO、内容、Reddit、LinkedIn、小红书和 App Store。
```

### paid-media-agency

适合：PPC 搜索广告、Meta/TikTok/LinkedIn/Reddit 付费社交、程序化展示广告、广告创意测试、转化跟踪、广告账户审计。

典型输出：

- 渠道和预算策略
- Campaign 结构
- 创意测试矩阵
- 跟踪和归因方案
- 优化和审计建议

示例：

```text
用 Paid Media Agency 帮我设计 AI 记账工具的首月广告投放计划，预算 3000 美元，目标是获取第一批付费用户。
```

### finance-agency

适合：账务整理、月结、财务分析、预算和预测、现金流/runway、投资研究、税务准备和财务风险审查。

典型输出：

- 财务分析报告
- 账务和月结清单
- 预算和情景预测
- 投资研究摘要
- 税务准备和风险提醒

示例：

```text
用 Finance Agency 帮我分析 AI 记账工具的 12 个月预算、现金流、runway 和税务准备风险。注意不要提供正式税务或投资建议。
```

### code-review-squad

适合：PR 审查、安全审查、性能审查、测试补齐。

典型输出：

- 审查发现
- 风险等级
- 测试缺口
- 修复建议
- 发布建议

示例：

```text
用代码审查小队审查当前项目的 Agent Team 配置，找出结构、可维护性和测试风险。
```

### testing-agency

适合：测试结果分析、性能基准、API 测试、工具评估、工作流优化、可访问性测试、证据和现实性检查。

典型输出：

- 测试结果分析
- 性能和 API 测试计划
- 工具评估
- 工作流优化
- 证据和可访问性 findings

示例：

```text
用 Testing Agency 分析当前测试输出，找出失败原因、API/性能/可访问性测试缺口，并给出再验证计划。
```

### support-agency

适合：客户支持回复、问题分类、FAQ 和宏回复、财务跟踪、基础设施维护、合规升级、周报/月报和高层摘要。

典型输出：

- 支持回复
- 问题分类和升级
- 财务和基础设施摘要
- 合规风险
- 高层摘要

示例：

```text
用 Support Agency 处理这条用户工单，输出建议回复、问题分类、是否升级、FAQ 建议和合规风险。
```

### spatial-computing-agency

适合：visionOS 应用、AR/VR/MR/XR 产品、空间界面设计、沉浸式体验、Metal/3D 性能、空间 dashboard/cockpit、终端或开发者工具空间化。

典型输出：

- 空间界面架构
- visionOS/XR 实现方案
- 沉浸式场景计划
- 性能和舒适度风险
- 验证计划

示例：

```text
用 Spatial Computing Agency 帮我规划一个 visionOS 版 AI 记账工具，覆盖空间界面、窗口/volume/immersive space、RealityKit、舒适度、性能和测试。
```

### specialized-agency

适合：MCP/tooling、跨系统 workflow、文档生成和审查、法律/医疗/金融/房地产/HR/客服等专业 intake、合规审计、模型 QA。

典型输出：

- 专业 intake
- 工作流和工具方案
- 文档草案或审查
- 合规和风险提示
- 模型 QA 报告

示例：

```text
用 Specialized Agency 帮我设计一个 MCP 工具和跨系统 workflow，让 AI 可以安全查询 CRM、生成支持摘要，并在高风险情况升级人工审批。
```

### evidence-quality-agency

适合：检查一个方案、AI 输出或交付物是否可信，找出没有证据支持的假设。

典型输出：

- 已验证事实
- 未验证项
- 风险清单
- 现实性建议
- 下一步验证

示例：

```text
用 Evidence Quality Agency 检查这个 AI 记账工具 MVP 方案是否可信，有哪些未验证假设。
```

### production-readiness-agency

适合：上线前检查、发布风险评估、DevOps 自动化、安全合规复核。

典型输出：

- 构建和测试检查
- 安全与合规风险
- 监控和回滚计划
- Go/No-Go 建议

示例：

```text
用 Production Readiness Agency 帮我做 AI 记账工具上线前 Go/No-Go 检查。
```

## 5. 标准使用方式

### 最简单

```text
用 Agent Team 帮我规划一个 AI 记账工具 MVP
```

### 指定团队

```text
用 Full Stack Agency 帮我规划一个 AI 记账工具，从产品、UX、前后端、安全和测试拆解。
```

### 指定输出深度

```text
用产品开发小队帮我规划一个 AI 记账工具 MVP。请输出：目标用户、MVP 范围、不做范围、技术方案、开发任务、测试计划。
```

### 指定约束

```text
用 Full Stack Agency 规划 AI 记账工具 MVP。约束：两周完成、单人开发、先做 Web App、不接银行账户、不做投资建议。
```

### 指定复核

```text
用 Evidence Quality Agency 复核上面的 MVP 方案，重点找：不现实的范围、隐私风险、AI 识别错误风险、缺少验证的假设。
```

## 6. 工作流如何运行

工作流文件是 YAML。以 `full-stack-product-pipeline.yaml` 为例，它会按这个顺序组织员工：

1. `agency-orchestrator`：判断任务需要哪些 division 和交付物。
2. `product-manager`：输出产品目标、MVP 范围和验收标准。
3. `ux-researcher`：输出用户假设、核心任务和验证实验。
4. `ui-designer`：输出页面结构、关键状态和可用性风险。
5. `backend-architect`：输出数据模型、API、权限边界和后端风险。
6. `frontend-developer`：输出页面、组件、状态和验证路径。
7. `security-engineer`：输出安全基线。
8. `qa-reviewer`：输出测试矩阵和发布风险。
9. `project-manager`：汇总交付路线图。

`depends_on` 表示步骤依赖。没有依赖的步骤先执行，同一层级可以并行处理。

## 7. 推荐输出格式

所有团队最终汇总时建议使用：

1. 背景理解
2. 分工结果
3. 决策建议
4. 风险/疑问
5. 下一步行动

如果你想要更工程化的输出，可以这样要求：

```text
最后请用表格输出：任务、负责人、输入、输出、验收标准、风险。
```

如果你想要更像产品文档：

```text
最后请整理成 PRD：背景、目标用户、用户故事、MVP 范围、非目标、验收标准、风险。
```

如果你想要开发计划：

```text
最后请整理成开发计划：里程碑、任务拆分、文件/模块、测试方式、交付顺序。
```

## 8. 常见场景

### 场景 A：从想法到 MVP

```text
用产品开发小队帮我规划一个 AI 记账工具 MVP。目标用户是记账坚持不下来的人，第一版只做 Web App。
```

适合输出：

- MVP 范围
- 不做范围
- 技术方案
- 验收标准

### 场景 B：完整产品交付计划

```text
用 Full Stack Agency 把 AI 记账工具规划成完整交付计划。请覆盖产品、用户体验、界面、前端、后端、安全、测试和上线顺序。
```

适合输出：

- 产品规格
- UX/UI
- API 和数据模型
- 前端状态
- 安全基线
- 测试矩阵
- 交付路线图

### 场景 C：增长发布

```text
用 Launch Growth Agency 帮 AI 记账工具设计发布方案。目标用户是自由职业者和轻度理财用户，预算很低。
```

适合输出：

- 定位语
- 落地页文案
- 渠道实验
- 指标方案
- 发布节奏

### 场景 D：检查方案是否靠谱

```text
用 Evidence Quality Agency 检查上面的方案。请区分：已验证事实、未验证假设、需要用户确认的问题、必须缩小范围的地方。
```

适合输出：

- 证据清单
- 未验证项
- 现实性风险
- 下一步验证

### 场景 E：上线前检查

```text
用 Production Readiness Agency 做上线前检查。发布范围是：AI 文字记账、账目列表、月度总结、预算提醒。
```

适合输出：

- 发布检查表
- 阻塞项
- 风险接受项
- 回滚计划
- Go/No-Go 建议

## 9. 如何新增员工

在对应 division 目录中新建一个 `.md` 文件。例如工程角色放到：

- [agent-team/employees/engineering](/Users/gegarron/Documents/AI Agent/agent-team/employees/engineering)

Paid Media 角色放到：

- [agent-team/employees/paid-media](/Users/gegarron/Documents/AI Agent/agent-team/employees/paid-media)

模板：

```markdown
---
id: data-scientist
name: Data Scientist
role: strategy/data-scientist
responsibilities:
  - 分析数据和模型效果
  - 设计评估指标
inputs:
  - 数据样本
  - 业务目标
outputs:
  - 分析报告
  - 指标建议
tools:
  - local files
  - spreadsheets when provided
handoff_to:
  - analytics-reporter
  - product-manager
---

## 行为准则

你负责把数据转成可执行判断。没有数据时不要编造数字。

## 交付格式

- 数据概况
- 指标
- 发现
- 建议
```

新增后运行：

```bash
npm test
```

## 10. 如何新增技能

在对应 division 目录中新建一个 `.md` 文件。例如：

- [agent-team/skills/engineering](/Users/gegarron/Documents/AI Agent/agent-team/skills/engineering)
- [agent-team/skills/design](/Users/gegarron/Documents/AI Agent/agent-team/skills/design)
- [agent-team/skills/paid-media](/Users/gegarron/Documents/AI Agent/agent-team/skills/paid-media)

模板：

```markdown
# Skill: Data Analysis

## 用途

分析数据、指标和实验结果。

## 输入

- 数据
- 业务目标

## 方法

1. 检查数据完整性。
2. 定义指标。
3. 分析趋势和异常。
4. 输出决策建议。

## 输出

- 指标摘要
- 关键发现
- 风险
- 下一步
```

## 11. 如何新增团队

在对应 division 目录中新建一个 `.yaml` 文件。例如：

- [agent-team/teams/engineering](/Users/gegarron/Documents/AI Agent/agent-team/teams/engineering)
- [agent-team/teams/product](/Users/gegarron/Documents/AI Agent/agent-team/teams/product)
- [agent-team/teams/paid-media](/Users/gegarron/Documents/AI Agent/agent-team/teams/paid-media)

模板：

```yaml
id: data-insight-agency
name: Data Insight Agency
description: 数据分析、指标设计和实验复盘团队。
use_when:
  - 数据分析
  - 指标设计
  - 实验复盘
members:
  lead: analytics-reporter
  contributors:
    - product-manager
    - reality-checker
default_workflows:
  - data-insight-review
deliverables:
  - 指标定义
  - 分析结论
  - 风险
  - 下一步行动
```

注意：

- `lead` 和 `contributors` 必须引用已存在的 employee id。
- `default_workflows` 必须引用已存在的 workflow 文件名。

## 12. 如何新增工作流

在对应 division 目录中新建一个 `.yaml` 文件。例如：

- [agent-team/workflows/engineering](/Users/gegarron/Documents/AI Agent/agent-team/workflows/engineering)
- [agent-team/workflows/product](/Users/gegarron/Documents/AI Agent/agent-team/workflows/product)
- [agent-team/workflows/paid-media](/Users/gegarron/Documents/AI Agent/agent-team/workflows/paid-media)

模板：

```yaml
name: data-insight-review
description: 分析数据并输出指标、发现和行动建议。
team: data-insight-agency
inputs:
  - name: dataset
    required: true
  - name: business_goal
    required: false
steps:
  - id: define_metrics
    employee: analytics-reporter
    skill: analytics-reporting
    task: "基于业务目标定义指标：{{business_goal}}\n数据：{{dataset}}"
    output: metrics
  - id: reality_review
    employee: reality-checker
    skill: evidence-qa
    depends_on:
      - define_metrics
    task: "检查指标和结论是否有证据支持：{{metrics}}"
    output: reality_review
```

注意：

- `team` 必须引用已存在团队。
- `employee` 必须引用已存在员工。
- `skill` 必须引用已存在技能。
- `depends_on` 必须引用前面某个步骤的 `id`。
- `{{变量名}}` 只能引用输入或依赖步骤的 `output`。

## 13. 校验和排错

每次新增或修改后运行：

```bash
npm test
```

通过时会看到：

```text
Agent Team validation passed.
Employees: 18
Skills: 15
Teams: 7
Workflows: 7
Divisions: 6
```

常见错误：

| 错误 | 原因 | 处理 |
| --- | --- | --- |
| `references missing employee` | 团队或 division 引用了不存在的员工 | 检查 employee id 是否拼错 |
| `references missing skill` | 工作流引用了不存在的技能 | 在 `skills/` 新增技能或修正名称 |
| `depends on missing step` | `depends_on` 写了不存在的步骤 id | 修正步骤 id |
| `references unavailable variable` | 使用了没有输入或没有依赖的 `{{变量}}` | 补 `depends_on` 或改变量名 |
| `duplicate or missing step outputs` | 多个步骤输出名重复或缺失 | 给每一步设置唯一 `output` |

## 14. 使用建议

- 简单任务不要拉满 Full Stack Agency，直接用具体小队。
- 复杂任务先用 `agency-orchestrator` 或 `Full Stack Agency` 做路由。
- 方案写完后，用 `Evidence Quality Agency` 做一次现实性复核。
- 上线前，用 `Production Readiness Agency` 做 Go/No-Go。
- 涉及法律、金融、医疗和隐私时，让 `legal-compliance-checker` 和 `security-engineer` 参与，但最终仍需专业人士确认。
- 所有 AI 输出都应允许用户修改、确认和追问。

## 14.1 中文化和复用规则

从外部 agent 库迁移角色时，推荐遵守：

- `id`、文件名、`role`、workflow `name` 保持英文，方便机器引用和未来迁移。
- `name` 可以保留英文，也可以写成中文 + 英文，例如 `PPC 投放策略师`。
- `responsibilities`、`inputs`、`outputs`、行为准则、交付格式和 workflow `task` 尽量中文化。
- 可以复用原提示词的角色结构、职责、流程和交付物，但不要机械整段照搬；应压缩、翻译并适配 Codex 本地工具和工作流。
- 在 `agency.yaml` 或文档里保留 `inspired_by` 来源链接，方便追溯。

## 15. 推荐工作节奏

一个完整项目可以这样跑：

1. `product-development-squad`：定义 MVP。
2. `full-stack-agency`：拆完整交付计划。
3. `evidence-quality-agency`：检查假设和风险。
4. `product-development-squad`：拆第一阶段开发任务。
5. `code-review-squad`：审查实现。
6. `production-readiness-agency`：上线前检查。
7. `launch-growth-agency`：发布、增长和复盘。

这样可以避免一开始就过度设计，也能在关键节点有质量门。
