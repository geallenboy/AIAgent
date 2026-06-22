---
name: agent-team
description: Use when Claude Code should route developer work through local Developer Agent workflows: feature planning, engineering routing, code review, testing, launch readiness, MCP/tooling, model QA, or open-source project analysis.
---

# Developer Agent for Claude Code

Use `/agent-team` for local Developer Agent workflows. Prefer the configured `agent-team` MCP server. The MCP server is the source of truth for workflows, run state, generated step prompts, approval requests, and event logs.

## Workflow

1. Call `list_workflows` unless the user named a workflow id.
2. Call `describe_workflow` for the chosen workflow.
3. Call `create_run` with workflow inputs inferred from the user request.
4. Call `get_next_action` to decide whether to execute a ready step, ask for approval, wait, or summarize completion.
5. For `execute_step`, perform the returned prompt in Claude Code, then call `submit_step_output` with Markdown output.
6. For `approval_required`, explain the capability and reason before calling `approve_step`.
7. Continue until the run succeeds, is cancelled, or is blocked by missing user input.

## Guardrails

- Do not bypass permission requests.
- Do not place credentials or private user data in artifacts.
- Do not read every YAML/Markdown file when MCP can provide focused registry data.
- Keep output focused on development work: context, team choice, step results, decisions, risks/questions, next actions.

Example:

```text
/agent-team 用 pr-code-review 审查当前变更
```
