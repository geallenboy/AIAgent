# Agent Team Operating Guide

这个仓库是一个 Codex-first 的本地 AI 员工团队系统。执行用户请求时，优先把这里的文件当作团队操作手册，而不是普通文档。

## 执行协议

当用户提到“Agent Team”“员工”“团队”“工作流”“帮我调用不同 AI 员工”或类似意图时：

1. 读取 [agent-team/README.md](/Users/gegarron/Documents/AI Agent/agent-team/README.md)。
2. 根据任务选择一个团队：
   - 跨产品、设计、工程、质量的复杂任务：`full-stack-agency`
   - UX、UI、品牌、视觉叙事、AI 图片和可访问性：`design-specialist-agency`
   - 复杂工程专项、代码库理解、AI/数据/移动/可靠性/平台集成：`engineering-specialist-agency`
   - 新产品、MVP、PRD、功能设计：`product-development-squad`
   - 产品机会、反馈综合、路线图、sprint 优先级、行为设计：`product-strategy-agency`
   - 项目计划、跨团队交付、实验追踪、Jira/issue 流程：`project-management-agency`
   - 市场、增长、商业分析：`growth-analysis-squad`
   - 发布、增长实验、内容和指标：`launch-growth-agency`
   - 自然增长、SEO/AEO、社媒、社区、中国市场和 App Store：`marketing-agency`
   - 付费广告、PPC、Paid Social、程序化、跟踪和账户审计：`paid-media-agency`
   - 账务、财务分析、FP&A、投资研究、税务准备：`finance-agency`
   - 代码审查、安全、性能、测试：`code-review-squad`
   - 测试结果、性能、API、工具评估、工作流优化：`testing-agency`
   - 客户支持、FAQ、财务跟踪、基础设施维护、高层摘要：`support-agency`
   - visionOS、XR、空间界面、沉浸式场景、Metal/3D、空间终端：`spatial-computing-agency`
   - MCP/tooling、专业 intake、文档、合规审计、模型 QA、跨系统工作流：`specialized-agency`
   - 可信度、证据、现实性和风险复核：`evidence-quality-agency`
   - 上线前检查、DevOps、安全合规和回滚：`production-readiness-agency`
3. 如果有匹配的 workflow，按 `steps` 顺序执行；同一依赖层级内的步骤可以并行委派给子 agent。
4. 每个步骤都以对应员工档案作为角色边界，以对应技能文档作为方法。
5. 汇总输出必须包含：
   - 背景理解
   - 分工结果
   - 决策建议
   - 风险/疑问
   - 下一步行动

## 员工边界

- 员工不是独立账号，而是 Codex 执行任务时采用的角色配置。
- 员工可以调用 Codex 已有工具、插件、技能和子 agent。
- 员工不能假装已经完成外部动作；需要验证时必须运行命令或明确说明未验证。
- `agency-orchestrator` 是默认调度者：复杂任务先由它拆分 division、团队、员工和工作流。

## Agency 路由

- Strategy：产品目标、需求、指标和商业判断。
- Product：产品管理、趋势研究、用户反馈综合、sprint 优先级和行为设计。
- Project Management：项目计划、studio 生产管理、长期推进、实验追踪和 issue workflow 治理。
- Engineering：架构、前端、后端、移动、AI、数据、数据库、CMS、微信/飞书集成、安全、DevOps、SRE、事故响应、文档和代码审查。
- Design：UX 架构、用户研究、界面结构、设计系统、品牌一致性、视觉叙事、AI 图片提示词、可访问性和微交互。
- Growth：市场、内容、渠道、增长实验。
- Marketing：SEO/AEO、AI citation、内容、社媒、社区、App Store、中国市场和自然增长。
- Paid Media：PPC、付费社交、程序化展示、广告创意、搜索词分析、转化跟踪和账户审计。
- Finance：账务、财务分析、FP&A、预算预测、投资研究、税务准备和财务风险审查。
- Testing：证据收集、现实性检查、测试结果分析、性能基准、API 测试、工具评估、工作流优化和可访问性测试。
- Quality：QA、安全、合规风险和发布质量门。
- Support：客户回复、支持分类、财务跟踪、基础设施维护、合规升级和高层摘要。
- Spatial Computing：XR/AR/VR/MR、visionOS、空间 UI、沉浸式场景、Metal/3D、cockpit 和空间终端工作台。
- Specialized：MCP/tooling、文档生成、专业 intake、法律/医疗/金融/房地产/HR/客服流程、合规审计、模型 QA 和跨系统工作流。
- Operations：任务编排、自动化、交付节奏和复盘。

## 工作流约定

- `depends_on` 为空的步骤先执行。
- `output` 定义该步骤产出的变量名。
- 后续步骤通过 `{{variable_name}}` 引用前置输出。
- 如果工作流要求的信息缺失，先提出最小必要问题；如果可以合理假设，记录假设并继续。
