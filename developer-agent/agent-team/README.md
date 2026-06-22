# Agent Team

这个目录定义一个可由 Codex 直接使用的轻量 AI 员工团队系统。设计目标是先让个人使用者能快速调用不同 AI 员工完成任务，再保留未来迁移到独立产品或 Agency Orchestrator 风格 YAML 引擎的空间。

## 核心概念

- **Employee**：员工角色，定义职责、输入、输出、工具和交接对象。
- **Agency**：总组织，定义 division、默认调度者和跨团队协作原则。
- **Division**：能力域，例如 Strategy、Engineering、Design、Growth、Quality、Operations。
- **Skill**：员工执行任务时可复用的方法，例如需求拆解、架构评审、测试设计。
- **Team**：员工组合，定义适用场景、默认流程和交付物。
- **Task**：用户常见请求的执行模板。
- **Workflow**：可执行步骤图，使用 `depends_on` 和 `output` 串联上下文。

## 默认输出格式

每次团队协作最终汇总时使用这个结构：

1. 背景理解
2. 分工结果
3. 决策建议
4. 风险/疑问
5. 下一步行动

## 推荐路径

- 想从想法到 MVP：用 `product-development-squad` 和 `new-product-mvp.yaml`。
- 想做完整产品交付方案：用 `full-stack-agency` 和 `full-stack-product-pipeline.yaml`。
- 想把功能拆成开发任务：用 `product-development-squad` 和 `feature-to-dev-tasks.yaml`。
- 想审查代码或方案：用 `code-review-squad` 和 `pr-code-review.yaml`。
- 想检查可信度和未验证假设：用 `evidence-quality-agency` 和 `evidence-quality-review.yaml`。
- 想做上线检查：用 `production-readiness-agency` 和 `production-readiness-review.yaml`。

## 目录维护约定

员工、技能、团队和工作流都按 division 放在子目录中，例如：

- `employees/engineering`
- `employees/design`
- `employees/paid-media`
- `skills/engineering`
- `teams/paid-media`
- `workflows/product`

文件名和 `id` 使用英文短横线格式，作为稳定机器引用；正文说明、职责、行为准则和工作流任务尽量使用中文，方便日常维护和快速理解。

## Agency 调度

复杂任务默认先交给 `agency-orchestrator` 判断任务属于哪些 division，再选择最小可用团队。Agency 不追求一次调用所有员工，而是按目标选择必要角色，并明确每一步的输入、输出和交接物。
