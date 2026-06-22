import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadRegistry } from "../src/agent-team/registry.js";
import {
  approveStep,
  createRun,
  getRun,
  listEvents,
  submitStepOutput,
} from "../src/agent-team/runtime.js";

async function write(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function createRuntimeFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-team-runtime-"));
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
  await write(path.join(root, "agent-team/employees/test/researcher.md"), employee("researcher", "web research"));
  await write(path.join(root, "agent-team/skills/test/planning.md"), "# Planning\n");
  await write(path.join(root, "agent-team/skills/test/writing.md"), "# Writing\n");
  await write(path.join(root, "agent-team/skills/test/research.md"), "# Research\n");
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
  - researcher
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
  - id: draft
    employee: writer
    skill: writing
    depends_on:
      - plan
    task: "Write from {{plan_output}}"
    output: draft_output
`,
  );
  await write(
    path.join(root, "agent-team/workflows/test/no-network-workflow.yaml"),
    `name: no-network-workflow
team: test-team
inputs:
  - name: repo_url
    required: true
  - name: constraints
    required: false
steps:
  - id: scan
    employee: researcher
    skill: research
    task: "Research web facts for {{repo_url}} under {{constraints}}"
    output: scan_output
`,
  );
  return root;
}

test("createRun expands a workflow into ready and pending step runs", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);

  const run = await createRun(root, registry, "test-workflow", { idea: "local scheduler" });

  assert.equal(run.workflowId, "test-workflow");
  assert.equal(run.status, "running");
  assert.equal(run.steps.find((step) => step.stepId === "plan").status, "ready");
  assert.equal(run.steps.find((step) => step.stepId === "draft").status, "pending");
  assert.equal(run.steps.find((step) => step.stepId === "plan").prompt.includes("Plan local scheduler"), true);
});

test("createRun treats required false inputs as optional", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);

  const run = await createRun(root, registry, "no-network-workflow", {
    repo_url: "local repo",
  });

  assert.equal(run.inputs.constraints, undefined);
  assert.equal(run.steps.find((step) => step.stepId === "scan").status, "waiting_approval");
});

test("createRun suppresses network approval when inputs require local-only work", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);

  const run = await createRun(root, registry, "no-network-workflow", {
    repo_url: "local repo",
    constraints: "仅本地事实，不联网",
  });

  const scan = run.steps.find((step) => step.stepId === "scan");
  assert.equal(scan.status, "ready");
  assert.equal(scan.permissionRequests.some((request) => request.capability === "network"), false);
});

test("submitStepOutput stores artifacts and advances dependent steps to permission approval", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);
  const run = await createRun(root, registry, "test-workflow", { idea: "runtime" });
  const outputFile = path.join(root, "output.md");
  await writeFile(outputFile, "A concise plan");

  const updated = await submitStepOutput(root, registry, run.id, "plan", outputFile);

  const plan = updated.steps.find((step) => step.stepId === "plan");
  const draft = updated.steps.find((step) => step.stepId === "draft");
  assert.equal(plan.status, "succeeded");
  assert.equal(plan.artifactIds.length, 1);
  assert.equal(draft.status, "waiting_approval");
  assert.equal(draft.permissionRequests[0].capability, "write_files");
  assert.equal(draft.prompt.includes("A concise plan"), true);
});

test("approveStep moves a waiting step to ready and records audit events", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);
  const run = await createRun(root, registry, "test-workflow", { idea: "runtime" });
  const outputFile = path.join(root, "output.md");
  await writeFile(outputFile, "A concise plan");
  await submitStepOutput(root, registry, run.id, "plan", outputFile);

  const approved = await approveStep(root, registry, run.id, "draft", "write_files");
  const draft = approved.steps.find((step) => step.stepId === "draft");
  const events = await listEvents(root, run.id);

  assert.equal(draft.status, "ready");
  assert.equal(draft.permissionRequests[0].status, "approved");
  assert.equal(events.some((event) => event.type === "permission.approved"), true);
});

test("getRun persists run state on disk", async () => {
  const root = await createRuntimeFixture();
  const registry = await loadRegistry(root);
  const run = await createRun(root, registry, "test-workflow", { idea: "persist" });

  const persisted = await getRun(root, run.id);

  assert.equal(persisted.id, run.id);
  assert.equal(persisted.steps.length, 2);
});
