# Developer Agent 提示词示例库

把示例里的功能、仓库、约束替换成你的实际情况即可。

## 1. MVP 技术规划

```text
用 product-development-squad 规划一个开发者工具 MVP。
目标：读取本地项目，生成模块关系和测试建议。
约束：先做 CLI，不做云端同步。
请输出：核心场景、MVP 范围、不做范围、技术方案、验收标准、开发顺序。
```

## 2. 功能拆解

```text
用 feature-to-dev-tasks 把这个功能拆成开发任务：
用户上传 CSV 后，系统解析字段、展示预览、允许修正列类型并保存导入任务。
请输出：数据流、接口、前端状态、后端任务、测试用例和实现顺序。
```

## 3. 工程专家路由

```text
用 engineering-specialist-routing 处理这个工程任务：
我要把现有 Node.js CLI 改成 MCP server，并保留原 CLI 使用方式。
请输出：需要哪些工程角色、关键路径、风险、验证计划和交接文档。
```

## 4. 代码审查

```text
用 pr-code-review 审查当前代码变更。
重点检查：行为回归、架构边界、安全风险、测试缺口和发布风险。
输出按严重程度排序：P0/P1/P2 findings、测试缺口、剩余风险。
```

## 5. 测试质量分析

```text
用 testing-quality-review 分析下面的测试输出。
请输出：失败分类、根因假设、再验证命令、API/性能/可访问性测试缺口。
```

## 6. 上线前检查

```text
用 production-readiness-review 做上线前检查。
发布范围：新增 MCP server、run runtime、Workbench 查看 run 状态。
验证结果：npm run validate 通过，npm test 通过。
请输出：阻塞项、可接受风险、监控项、回滚计划、Go/No-Go 建议。
```

## 7. MCP 工具设计

```text
用 mcp-workflow-design 设计一个 MCP 工具。
目标：让 agent 查询本地项目 registry、创建任务 run、读取 step prompt 并提交 Markdown 输出。
请输出：tools/resources、输入输出 schema、权限、失败恢复和审计事件。
```

## 8. 模型或 agent QA

```text
用 model-qa-review 复核这个 agent 输出。
任务规格：不得编造验证结果；涉及命令、网络、git 写操作时必须说明是否已授权和已执行。
请输出：rubric、失败分类、回归测试建议和提示词改进点。
```

## 9. 开源项目技术分析

```text
用 open-source-project-analysis 分析这个 GitHub 项目：
repo_url: <REPO_URL>
user_goal: 判断是否适合改造成我们项目里的 MCP server
constraints: 只做技术评估，不做外部发布
请输出：项目定位、架构、数据流、集成成本、风险和最小试用路径。
```
