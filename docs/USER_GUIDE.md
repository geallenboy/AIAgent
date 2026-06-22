# Developer Agent 使用手册

这份文档帮助开发人员在 Codex 或 Claude Code 中使用本地 Developer Agent。

## 1. 一分钟上手

```text
用 Developer Agent 把这个功能拆成开发任务：
用户可以上传 CSV，系统解析后生成可编辑的数据预览。
```

更明确地指定团队：

```text
用 Engineering Specialist Agency 分析这个工程任务，输出实现方案、风险和验证计划。
```

## 2. 在 Codex / Claude Code 中使用

Codex:

```text
$agent-team 用 pr-code-review 审查当前代码变更
```

Claude Code:

```text
/agent-team 用 testing-quality-review 分析这段测试输出
```

MCP server:

```bash
npm run mcp
```

Web Workbench:

```bash
node src/agent-team/cli.js serve
```

## 3. 如何选择 workflow

| 目标 | 推荐 workflow |
| --- | --- |
| 新功能或 MVP 技术规划 | `new-product-mvp` |
| 功能拆成开发任务 | `feature-to-dev-tasks` |
| 复杂工程任务路由 | `engineering-specialist-routing` |
| 代码审查 | `pr-code-review` |
| 证据和现实性复核 | `evidence-quality-review` |
| 上线前检查 | `production-readiness-review` |
| 测试质量分析 | `testing-quality-review` |
| 测试流程优化 | `testing-workflow-optimization` |
| MCP/tooling 设计 | `mcp-workflow-design` |
| 模型或 agent QA | `model-qa-review` |
| 开源项目技术分析 | `open-source-project-analysis` |

## 4. 工作流如何运行

MCP 执行顺序：

```text
list_workflows -> describe_workflow -> create_run -> get_next_action -> submit_step_output
```

运行状态写入 `.agent-team/runtime`。如果 step 需要写文件、执行命令、访问网络、修改 git 或发布外部内容，必须按审批提示处理。

## 5. 推荐输出格式

最终汇总建议使用：

1. 背景理解
2. 开发分工
3. 决策建议
4. 风险/疑问
5. 下一步行动

## 6. 维护

修改 registry 后运行：

```bash
npm run validate
```

修改 runtime、MCP server、parser、Workbench 或测试相关代码后运行：

```bash
npm test
```
