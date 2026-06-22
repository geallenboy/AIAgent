---
name: agent-team
description: Use when the user asks Claude Code to use Agent Team, AI employees, teams, agencies, workflows, MVP planning, code review, launch readiness, evidence quality, or cross-functional collaboration in this repository.
---

# Agent Team for Claude Code

Use `/agent-team` for local Agent Team workflows. Prefer the configured `agent-team` MCP server. The MCP server is the source of truth for workflows, run state, generated step prompts, approval requests, and event logs.

## Workflow

1. Call `list_workflows` unless the user named a workflow id.
2. Call `describe_workflow` for the chosen workflow.
3. Call `create_run` with the workflow inputs inferred from the user request.
4. Call `get_next_action` to decide whether to execute a ready step, ask for approval, wait, or summarize completion.
5. For `execute_step`, perform the returned prompt in Claude Code, then call `submit_step_output` with Markdown output.
6. For `approval_required`, explain the capability and reason before calling `approve_step`.
7. Continue until the run succeeds, is cancelled, or is blocked by missing user input.

## Guardrails

- Do not bypass permission requests.
- Do not place credentials or private user data in artifacts.
- Do not read every YAML/Markdown file when MCP can provide focused registry data.
- Keep output in the Agent Team summary shape: background, division/team choice, step results, decisions, risks/questions, next actions.

Example:

```text
/agent-team 用 new-product-mvp 跑这个产品想法：AI 记账工具，两周 MVP
```
