# Agent Team 模块总览

这份文档用于快速了解当前 Agent Team 已经有哪些模块、每个模块能做什么、什么时候使用，以及可以直接复制的使用案例。

当前规模：

| 类型 | 数量 |
| --- | ---: |
| Divisions | 15 |
| Employees | 129 |
| Skills | 61 |
| Teams | 18 |
| Workflows | 27 |

## 1. 如何理解这个系统

你可以把这个项目理解为一个本地 AI Agency：

- **Division**：能力部门，例如 Product、Engineering、Marketing、Finance。
- **Employee**：AI 员工角色，例如 Product Manager、AI Engineer、Finance Analyst。
- **Skill**：员工执行任务时使用的方法，例如需求分析、API 测试、财务预测。
- **Team**：多个员工组成的可调用团队，例如 Full Stack Agency、Testing Agency。
- **Workflow**：固定协作流程，规定谁先做、产出什么、谁接着处理。

日常使用时，你不需要记住所有员工，只要直接调用团队：

```text
用 Product Strategy Agency 分析这个需求...
```

或者让系统自动路由：

```text
用 Agent Team 处理下面这个任务，并先告诉我你选择了哪个团队和原因：...
```

## 2. 快速选择表

| 你要做什么 | 推荐团队 | 典型结果 |
| --- | --- | --- |
| 从想法到 MVP | `product-development-squad` | MVP 范围、技术方案、验收标准 |
| 产品机会、反馈、路线图 | `product-strategy-agency` | 用户反馈、趋势、优先级、行为设计 |
| 完整产品交付计划 | `full-stack-agency` | 产品、UX、前后端、安全、测试、路线图 |
| 工程专项、AI/数据/移动/SRE | `engineering-specialist-agency` | 工程专家分工、实现策略、质量门 |
| UX/UI/品牌/可访问性 | `design-specialist-agency` | UX 架构、界面结构、品牌、视觉、可访问性 |
| 项目交付和 issue 流程 | `project-management-agency` | 里程碑、production board、实验台账 |
| 测试结果、API、性能 | `testing-agency` | 测试分析、性能基准、API 测试、质量门 |
| 代码审查 | `code-review-squad` | Findings、测试缺口、发布风险 |
| 上线前检查 | `production-readiness-agency` | Go/No-Go、阻塞项、回滚计划 |
| 证据和现实性复核 | `evidence-quality-agency` | 已验证事实、未验证项、风险 |
| 自然增长和内容营销 | `marketing-agency` | SEO/AEO、内容、社媒、社区、中国市场 |
| 发布增长 | `launch-growth-agency` | 定位、文案、增长实验、指标 |
| 付费广告 | `paid-media-agency` | 广告结构、创意测试、跟踪、审计 |
| 财务分析和预算 | `finance-agency` | 财务分析、预算、runway、税务准备 |
| 客户支持和运营摘要 | `support-agency` | 支持回复、FAQ、财务/基础设施摘要 |
| MCP、专业流程、模型 QA | `specialized-agency` | MCP 方案、专业 intake、模型 QA |
| visionOS/XR/空间计算 | `spatial-computing-agency` | 空间 UI、visionOS、沉浸场景、性能 |

## 3. Division 详细说明

### 3.1 Strategy Division

**定位**：产品目标、需求、指标和商业判断。

**典型员工**：

- `product-manager`
- `project-manager`
- `analytics-reporter`
- `agency-orchestrator`

**适合任务**：

- 产品方向判断
- 业务目标梳理
- 指标定义
- 跨团队初步路由

**使用案例**：

```text
用 Agent Team 帮我判断这个产品想法应该先用哪个团队处理：
我想做一个 AI 记账工具，目标是帮助用户坚持记账并理解消费模式。
```

### 3.2 Product Division

**定位**：产品管理、趋势研究、反馈综合、sprint 优先级和行为设计。

**团队**：

- `product-development-squad`
- `product-strategy-agency`
- `full-stack-agency`

**核心工作流**：

- `new-product-mvp`
- `feature-to-dev-tasks`
- `product-discovery-and-prioritization`
- `full-stack-product-pipeline`

**适合任务**：

- 从想法到 MVP
- 分析用户反馈
- 排 sprint 优先级
- 做产品路线图
- 设计激活和留存机制

**使用案例**：

```text
用 Product Strategy Agency 分析 AI 记账工具的用户反馈和 backlog。
用户反馈：记账太麻烦、分类不准、月度总结有用但不够具体。
Backlog：语音记账、图片小票识别、自动分类学习、预算提醒、微信小程序、月报分享。
约束：两周一个 sprint，单人开发。
请输出：反馈主题、机会假设、行为 nudge、sprint 优先级、延后事项和验收标准。
```

### 3.3 Engineering Division

**定位**：架构、前端、后端、移动、AI、数据、数据库、CMS、微信/飞书集成、安全、DevOps、SRE、事故响应、文档和代码审查。

**团队**：

- `engineering-specialist-agency`
- `code-review-squad`
- `production-readiness-agency`
- `full-stack-agency`

**核心工作流**：

- `engineering-specialist-routing`
- `pr-code-review`
- `production-readiness-review`

**适合任务**：

- 复杂工程任务拆解
- 代码库理解
- AI/数据/移动专项
- 数据库优化
- SRE/事故响应
- 技术文档

**使用案例**：

```text
用 Engineering Specialist Agency 处理这个工程任务：
我要给 AI 记账工具加入语音记账、图片识别、移动端 App、后端 API 和月度总结。
请先判断需要哪些工程专家，再输出分工、关键路径、风险、验证计划和交接文档。
```

### 3.4 Design Division

**定位**：UX 架构、用户研究、界面结构、设计系统、品牌一致性、视觉叙事、AI 图片提示词、可访问性和微交互。

**团队**：

- `design-specialist-agency`
- `full-stack-agency`

**核心工作流**：

- `design-specialist-routing`

**适合任务**：

- UX/UI 规划
- 品牌一致性审查
- 视觉故事和素材方向
- AI 图片提示词
- 可访问性检查

**使用案例**：

```text
用 Design Specialist Agency 帮我设计 AI 记账工具第一版体验。
请覆盖：UX 架构、用户路径、页面结构、组件状态、品牌语气、视觉故事、AI 图片提示词、可访问性和微交互。
约束：工具型产品，界面要清晰高效，不要做成营销页。
```

### 3.5 Project Management Division

**定位**：项目计划、studio 生产管理、长期推进、实验追踪和 issue workflow 治理。

**团队**：

- `project-management-agency`

**核心工作流**：

- `project-delivery-plan`
- `studio-operations-review`

**适合任务**：

- 制定项目交付计划
- 设计 production board
- 管理长期项目推进
- 建立实验台账
- 设计 Jira/Linear/GitHub Issues 工作流

**使用案例**：

```text
用 Project Management Agency 帮我制定 AI 记账工具 6 周交付计划。
目标：上线 Web MVP，包含自然语言记账、账目列表、月度总结、预算提醒。
团队：1 名全栈开发，1 名设计兼职，我作为产品负责人。
请输出：里程碑、任务依赖、production board、每周 review cadence、实验台账、GitHub Issues 工作流和风险。
```

### 3.6 Testing Division

**定位**：证据收集、现实性检查、测试结果分析、性能基准、API 测试、工具评估、工作流优化和可访问性测试。

**团队**：

- `testing-agency`
- `evidence-quality-agency`

**核心工作流**：

- `testing-quality-review`
- `testing-workflow-optimization`
- `evidence-quality-review`

**适合任务**：

- 分析测试失败
- 设计 API 测试矩阵
- 做性能基准计划
- 优化测试/发布流程
- 做可访问性检查

**使用案例**：

```text
用 Testing Agency 分析当前测试结果。
输入：我会贴测试输出或 CI 日志。
请输出：测试摘要、失败分类、根因假设、API 测试缺口、性能基准建议、可访问性检查和再验证命令。
```

### 3.7 Quality Division

**定位**：QA、安全、合规风险和发布质量门。

**团队**：

- `code-review-squad`
- `evidence-quality-agency`
- `production-readiness-agency`

**核心工作流**：

- `pr-code-review`
- `evidence-quality-review`
- `production-readiness-review`

**适合任务**：

- PR/代码审查
- 方案可信度检查
- 上线前 Go/No-Go
- 安全和合规风险复核

**使用案例**：

```text
用 Evidence Quality Agency 检查这个 AI 记账工具 MVP 方案。
请区分：已验证事实、未验证假设、需要用户确认的问题、隐私风险、范围过大的地方、建议缩小范围。
```

### 3.8 Marketing Division

**定位**：SEO/AEO、AI citation、内容、社媒、社区、App Store、中国市场和自然增长。

**团队**：

- `marketing-agency`
- `launch-growth-agency`
- `growth-analysis-squad`

**核心工作流**：

- `marketing-campaign-plan`
- `china-market-growth-plan`
- `go-to-market-launch`

**适合任务**：

- 自然增长计划
- SEO/AEO 内容集群
- 社媒内容策略
- 小红书/抖音/公众号/知乎/B 站策略
- App Store 优化
- 中国市场本地化

**使用案例**：

```text
用 Marketing Agency 帮我设计 AI 记账工具自然增长计划。
目标用户：自由职业者、学生、轻度理财用户。
目标市场：美国和中国。
请输出：渠道优先级、SEO/AEO 内容集群、AI citation 机会、Reddit/LinkedIn/小红书/抖音/公众号策略、App Store 优化、指标和 30 天执行计划。
```

### 3.9 Paid Media Division

**定位**：PPC、付费社交、程序化展示、广告创意、搜索词分析、转化跟踪和账户审计。

**团队**：

- `paid-media-agency`

**核心工作流**：

- `paid-media-campaign-plan`
- `paid-media-account-audit`

**适合任务**：

- 设计广告投放计划
- 搜索广告关键词和否词
- Meta/TikTok/LinkedIn 付费社交
- 创意测试矩阵
- 转化跟踪和归因
- 广告账户审计

**使用案例**：

```text
用 Paid Media Agency 帮我设计 AI 记账工具首月广告投放计划。
目标用户：自由职业者、学生、轻度理财用户。
预算：3000 美元。
渠道偏好：Google Search、Meta、TikTok。
请输出：渠道分配、campaign 结构、受众策略、关键词方向、创意测试矩阵、转化跟踪方案、优化节奏和停止规则。
```

### 3.10 Finance Division

**定位**：账务、财务分析、FP&A、预算预测、投资研究、税务准备和财务风险审查。

**团队**：

- `finance-agency`

**核心工作流**：

- `finance-operating-review`
- `finance-investment-tax-review`

**适合任务**：

- 账务整理和月结
- 财务指标分析
- 预算和预测
- burn rate 和 runway
- 投资研究摘要
- 税务准备和风险提醒

**使用案例**：

```text
用 Finance Agency 帮我做 AI 记账工具 12 个月财务运营分析。
输入：我会提供收入、成本、订阅、服务器、AI API、营销预算和团队成本。
请输出：账务分类建议、核心财务指标、burn rate、runway、base/upside/downside 情景、风险和下一步。
```

注意：Finance Division 只做分析和准备，不提供正式投资、税务、法律建议。

### 3.11 Support Division

**定位**：客户回复、支持分类、财务跟踪、基础设施维护、合规升级和高层摘要。

**团队**：

- `support-agency`

**核心工作流**：

- `support-ticket-triage`
- `support-ops-summary`

**适合任务**：

- 回复用户工单
- 分类支持问题
- 生成 FAQ/宏回复
- 做周报/月报
- 汇总财务、基础设施和支持数据

**使用案例**：

```text
用 Support Agency 处理这条用户工单：
“我上传了小票，但 AI 识别错了金额，还把餐饮分到了购物。我想知道你们会不会保存我的小票图片？”
产品：AI 记账工具。
请输出：问题分类、建议回复、需要用户补充的信息、是否升级到产品/工程/合规、FAQ 建议。
```

### 3.12 Specialized Division

**定位**：MCP/tooling、文档生成、专业 intake、法律/医疗/金融/房地产/HR/客服流程、合规审计、模型 QA 和跨系统工作流。

**团队**：

- `specialized-agency`

**核心工作流**：

- `specialized-domain-intake`
- `mcp-workflow-design`
- `model-qa-review`

**适合任务**：

- 设计 MCP 工具
- 专业领域 intake
- 法律/医疗/金融等高风险流程初步整理
- 文档生成和审查
- 模型/agent QA
- 跨系统自动化 workflow

**使用案例**：

```text
用 Specialized Agency 帮我设计一个 MCP 工具和跨系统 workflow。
目标：AI 可以查询 CRM 客户信息、读取最近支持工单、生成一页客户摘要，并在退款/法律/医疗等高风险场景升级人工审批。
请输出：工作流、MCP tools/resources、输入输出 schema、权限、失败恢复、审计和合规风险。
```

### 3.13 Spatial Computing Division

**定位**：XR/AR/VR/MR、visionOS、空间 UI、沉浸式场景、Metal/3D、cockpit 和空间终端工作台。

**团队**：

- `spatial-computing-agency`

**核心工作流**：

- `spatial-product-design`
- `visionos-implementation-plan`

**适合任务**：

- visionOS app 规划
- XR/AR/VR/MR 体验设计
- 空间 cockpit/dashboard
- Metal/3D 性能计划
- 终端或开发者工具空间化

**使用案例**：

```text
用 Spatial Computing Agency 帮我规划一个 visionOS 版 AI 记账工具。
目标：用户可以在空间里查看月度消费 dashboard、语音记账、拖拽分类、沉浸式查看消费趋势。
请输出：空间信息架构、window/volume/immersive space 选择、关键交互、RealityKit/SwiftUI 实现计划、性能预算、可访问性和舒适度风险。
```

### 3.14 Operations Division

**定位**：任务编排、自动化、交付节奏和复盘。

**团队关联**：

- `full-stack-agency`
- `production-readiness-agency`
- `project-management-agency`

**适合任务**：

- 自动化提醒
- DevOps 维护
- 发布节奏
- 复盘机制
- 团队运行优化

**使用案例**：

```text
用 Project Management Agency 和 Production Readiness Agency 帮我设计 AI 记账工具上线前的任务节奏、自动化检查、发布窗口和复盘流程。
```

### 3.15 Growth Division

**定位**：市场、内容、渠道、增长实验和商业验证。

**团队**：

- `growth-analysis-squad`
- `launch-growth-agency`
- `marketing-agency`

**核心工作流**：

- `go-to-market-launch`
- `marketing-campaign-plan`
- `china-market-growth-plan`

**适合任务**：

- 商业机会判断
- 增长实验
- 发布计划
- 内容和渠道组合

**使用案例**：

```text
用 Launch Growth Agency 帮我设计 AI 记账工具发布方案。
目标用户：自由职业者、学生、轻度理财用户。
预算：低预算，主要靠内容和社群。
请输出：定位语、价值主张、落地页结构、内容主题、渠道实验、指标和复盘节奏。
```

## 4. 推荐组合用法

### 从 0 到 1 做产品

```text
用 Agent Team 帮我从 0 到 1 规划 AI 记账工具。
请按顺序调用合适团队：Product Strategy、Full Stack、Design、Engineering、Testing、Project Management。
最后输出：产品机会、MVP 范围、体验方案、技术方案、测试计划、6 周交付计划。
```

### 做一次上线前复核

```text
用 Agent Team 帮我做 AI 记账工具上线前复核。
请结合 Testing Agency、Evidence Quality Agency、Production Readiness Agency、Security/Compliance 角色。
输出：已验证事实、阻塞项、风险接受项、回滚计划、Go/No-Go 建议。
```

### 做增长和商业化计划

```text
用 Agent Team 帮我规划 AI 记账工具的增长和商业化。
请结合 Marketing Agency、Paid Media Agency、Finance Agency、Launch Growth Agency。
输出：自然增长计划、广告投放计划、预算和 CAC 假设、指标和复盘节奏。
```

### 做高风险专业流程

```text
用 Specialized Agency 处理下面的专业流程，并在涉及法律、医疗、金融、税务时只做 intake 和风险提示，不提供正式专业意见：...
```

## 5. 维护和扩展原则

### 中文化规则

- `id`、文件名、workflow `name` 保持英文，方便机器引用。
- 正文说明、职责、行为准则、交付格式和 workflow `task` 尽量中文化。
- 外部 agent 的提示词可以复用结构和思想，但应翻译、压缩并适配 Codex 本地执行方式。

### 目录规则

按 division 分目录维护：

```text
agent-team/
  employees/<division>/
  skills/<division>/
  teams/<division>/
  workflows/<division>/
```

### 校验

每次新增或修改后运行：

```bash
npm test
```

通过时会看到当前规模统计，例如：

```text
Agent Team validation passed.
Employees: 129
Skills: 61
Teams: 18
Workflows: 27
Divisions: 15
```

## 6. 最常用提示词模板

### 自动路由

```text
用 Agent Team 处理下面这个任务。
请先告诉我你选择了哪个团队、为什么，然后按工作流执行：
...
```

### 指定团队

```text
用 <团队名> 帮我处理下面这个任务：
...
请输出：背景理解、分工结果、决策建议、风险/疑问、下一步行动。
```

### 要求更可执行

```text
请不要只给原则。
每个建议都要包含：负责人、输入、输出、验收标准、风险、下一步。
```

### 要求复核

```text
请用 Evidence Quality Agency 或 Testing Agency 复核上面的方案。
重点找：未验证假设、范围过大、测试缺口、安全/隐私/合规风险。
```

