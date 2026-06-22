import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { invokeAgentTeamTool } from "../src/agent-team/mcp-tools.js";

async function write(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function createMcpFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-team-mcp-"));
  const employee = (id, tools = "local files") => `---
id: ${id}
name: ${id}
role: test/${id}
responsibilities:
  - Do work
inputs:
  - Input
outputs:
  - Output
tools:
  - ${tools}
handoff_to:
  - ${id}
---
`;

  await write(path.join(root, "agent-team/employees/test/planner.md"), employee("planner"));
  await write(path.join(root, "agent-team/employees/test/writer.md"), employee("writer", "write files"));
  await write(path.join(root, "agent-team/skills/test/planning.md"), "# Planning\n");
  await write(path.join(root, "agent-team/skills/test/writing.md"), "# Writing\n");
  await write(
    path.join(root, "agent-team/teams/test/test-team.yaml"),
    `id: test-team
name: Test Team
members:
  lead: planner
  contributors:
    - writer
default_workflows:
  - test-workflow
`,
  );
  await write(
    path.join(root, "agent-team/agency/divisions/test.yaml"),
    `id: test
employees:
  - planner
  - writer
teams:
  - test-team
`,
  );
  await write(
    path.join(root, "agent-team/workflows/test/test-workflow.yaml"),
    `name: test-workflow
description: MCP workflow
team: test-team
inputs:
  - name: idea
    required: true
steps:
  - id: plan
    employee: planner
    skill: planning
    task: "Plan {{idea}}"
    output: plan_output
  - id: draft
    employee: writer
    skill: writing
    depends_on:
      - plan
    task: "Write from {{plan_output}}"
    output: draft_output
`,
  );
  return root;
}

test("MCP list_workflows and describe_workflow expose registry data", async () => {
  const root = await createMcpFixture();

  const listed = await invokeAgentTeamTool(root, "list_workflows", {});
  const described = await invokeAgentTeamTool(root, "describe_workflow", {
    workflowId: "test-workflow",
  });

  assert.equal(listed.ok, true);
  assert.equal(listed.data.workflows.some((workflow) => workflow.id === "test-workflow"), true);
  assert.equal(described.data.workflow.id, "test-workflow");
  assert.equal(described.data.workflow.steps.length, 2);
  assert.match(described.summary, /test-workflow/);
});

test("MCP create_run, get_step_prompt, submit output, and approve step share runtime state", async () => {
  const root = await createMcpFixture();

  const created = await invokeAgentTeamTool(root, "create_run", {
    workflowId: "test-workflow",
    inputs: { idea: "agent native integration" },
  });
  const runId = created.data.run.id;
  const ready = await invokeAgentTeamTool(root, "list_ready_steps", { runId });
  const firstAction = await invokeAgentTeamTool(root, "get_next_action", { runId });
  const prompt = await invokeAgentTeamTool(root, "get_step_prompt", { runId, stepId: "plan" });
  const afterOutput = await invokeAgentTeamTool(root, "submit_step_output", {
    runId,
    stepId: "plan",
    content: "A generated plan",
  });
  const approvalAction = await invokeAgentTeamTool(root, "get_next_action", { runId });
  const approved = await invokeAgentTeamTool(root, "approve_step", {
    runId,
    stepId: "draft",
    capability: "write_files",
  });
  const events = await invokeAgentTeamTool(root, "list_events", { runId });

  assert.equal(created.ok, true);
  assert.equal(ready.data.steps.map((step) => step.stepId).includes("plan"), true);
  assert.equal(firstAction.data.action, "execute_step");
  assert.equal(firstAction.data.stepId, "plan");
  assert.equal(prompt.data.prompt.includes("Plan agent native integration"), true);
  assert.equal(
    afterOutput.data.run.steps.find((step) => step.stepId === "draft").status,
    "waiting_approval",
  );
  assert.equal(approvalAction.data.action, "approval_required");
  assert.equal(approvalAction.data.stepId, "draft");
  assert.equal(approved.data.run.steps.find((step) => step.stepId === "draft").status, "ready");
  assert.equal(events.data.events.some((event) => event.type === "permission.approved"), true);
});

test("MCP cancel_run cancels unfinished steps", async () => {
  const root = await createMcpFixture();
  const created = await invokeAgentTeamTool(root, "create_run", {
    workflowId: "test-workflow",
    inputs: { idea: "cancel me" },
  });

  const cancelled = await invokeAgentTeamTool(root, "cancel_run", {
    runId: created.data.run.id,
  });

  assert.equal(cancelled.data.run.status, "cancelled");
  assert.equal(cancelled.data.run.steps.every((step) => step.status === "cancelled"), true);
});
