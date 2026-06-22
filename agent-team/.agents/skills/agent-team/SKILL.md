---
name: agent-team
description: Use when the user asks to use Agent Team, AI employees, teams, agencies, workflows, MVP planning, code review, launch readiness, evidence quality, or cross-functional product/design/engineering/growth collaboration in this repository.
---

# Agent Team

Use this skill to route work through the local Agent Team registry and runtime. Prefer the `agent_team` MCP server over manually reading every Markdown/YAML file or stitching together CLI commands.

## Workflow

1. Use `list_workflows` to inspect available workflows, unless the user named a workflow id.
2. Use `describe_workflow` for the chosen workflow and confirm required inputs from the user prompt.
3. Use `create_run` with `workflowId` and `inputs`.
4. Use `get_next_action` to decide whether to execute a ready step, ask for approval, wait, or summarize completion.
5. For an `execute_step` action, execute the returned prompt in the current Codex turn, then call `submit_step_output` with concise Markdown output.
6. For an `approval_required` action, explain the requested capability and reason to the user. Call `approve_step` only after approval or when the requested action is already clearly authorized by the user.
7. Repeat until the run is complete or blocked.
8. Summarize: background understanding, division/team choice, step outputs, decisions, risks/questions, and next actions.

## Guardrails

- Do not bypass Agent Team permission requests.
- Do not expose secrets, tokens, credentials, cookies, or private user data in step output.
- Do not scan the entire registry manually when MCP tools can return the needed workflow or run state.
- Keep scope narrow: choose the smallest workflow/team that satisfies the user request.
- If MCP is unavailable, fall back to `node src/agent-team/cli.js ...` and say MCP was unavailable.

## Common Prompts

- `$agent-team 用 new-product-mvp 规划一个 AI 记账工具 MVP`
- `$agent-team 用 pr-code-review 审查当前变更`
- `$agent-team 用 production-readiness-review 做上线前检查`
