# Developer Agent 模块总览

当前 Developer Agent 已收敛为开发人员使用的本地 agent registry。

| 类型 | 数量 |
| --- | ---: |
| Divisions | 6 |
| Employees | 47 |
| Skills | 21 |
| Teams | 7 |
| Workflows | 11 |

## Divisions

| Division | 职责 |
| --- | --- |
| Product | 开发需求澄清、MVP 技术范围、功能拆解 |
| Engineering | 架构、实现、平台、AI/数据、DevOps、安全、可靠性 |
| Testing | 测试输出、API、性能、工具评估、可访问性、流程优化 |
| Quality | 代码审查、证据复核、上线质量门 |
| Specialized | MCP/tooling、开源技术分析、模型/agent QA |
| Project Management | 开发交付顺序和下一步行动汇总 |

## Teams

| Team | Default workflows |
| --- | --- |
| `product-development-squad` | `new-product-mvp`、`feature-to-dev-tasks` |
| `engineering-specialist-agency` | `engineering-specialist-routing` |
| `code-review-squad` | `pr-code-review` |
| `evidence-quality-agency` | `evidence-quality-review` |
| `production-readiness-agency` | `production-readiness-review` |
| `testing-agency` | `testing-quality-review`、`testing-workflow-optimization` |
| `specialized-agency` | `open-source-project-analysis`、`mcp-workflow-design`、`model-qa-review` |

## Workflows

| Workflow | 适合任务 |
| --- | --- |
| `new-product-mvp` | 从产品想法生成 MVP 范围、技术方案和验收标准 |
| `feature-to-dev-tasks` | 把功能想法拆成开发任务和测试场景 |
| `engineering-specialist-routing` | 为复杂工程任务选择专家并输出执行计划 |
| `pr-code-review` | 审查代码变更、PR 或实现方案 |
| `evidence-quality-review` | 复核方案、实现或 AI 输出是否可信可验证 |
| `production-readiness-review` | 做上线前构建、测试、安全、监控、回滚检查 |
| `testing-quality-review` | 综合测试输出、API、性能、可访问性和证据 |
| `testing-workflow-optimization` | 优化测试、发布或 agent workflow |
| `mcp-workflow-design` | 设计 MCP tools、权限、失败恢复和审计 |
| `model-qa-review` | 测试模型、prompt、agent workflow 和工具调用质量 |
| `open-source-project-analysis` | 分析 GitHub 项目的技术定位、架构和采用风险 |

## 验证

```bash
npm run validate
npm test
```
