import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { handleApiRequest } from "../src/agent-team/server.js";

async function write(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function createServerFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-team-server-"));
  await write(
    path.join(root, "agent-team/employees/test/planner.md"),
    `---
id: planner
name: Planner
role: test/planner
responsibilities:
  - Plan
inputs:
  - Input
outputs:
  - Output
tools:
  - local files
handoff_to:
  - planner
---
`,
  );
  await write(path.join(root, "agent-team/skills/test/planning.md"), "# Planning\n");
  await write(
    path.join(root, "agent-team/teams/test/test-team.yaml"),
    `id: test-team
name: Test Team
members:
  lead: planner
default_workflows:
  - test-workflow
`,
  );
  await write(
    path.join(root, "agent-team/agency/divisions/test.yaml"),
    `id: test
employees:
  - planner
teams:
  - test-team
`,
  );
  await write(
    path.join(root, "agent-team/workflows/test/test-workflow.yaml"),
    `name: test-workflow
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
`,
  );
  return root;
}

test("local API exposes registry and run lifecycle", async () => {
  const root = await createServerFixture();

  const registryResponse = await handleApiRequest(root, "GET", "/api/registry");
  assert.equal(registryResponse.body.workflows.some((workflow) => workflow.id === "test-workflow"), true);

  const createResponse = await handleApiRequest(root, "POST", "/api/runs", {
    workflowId: "test-workflow",
    inputs: { idea: "api" },
  });
  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.workflowId, "test-workflow");

  const statusResponse = await handleApiRequest(root, "GET", `/api/runs/${createResponse.body.id}`);
  assert.equal(statusResponse.body.steps[0].prompt.includes("Plan api"), true);
});
