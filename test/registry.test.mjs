import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadRegistry, validateRegistry } from "../src/agent-team/registry.js";

async function write(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-team-registry-"));

  await write(
    path.join(root, "agent-team/employees/product/product-manager.md"),
    `---
id: product-manager
name: Product Manager
role: product/product-manager
responsibilities:
  - Define scope
inputs:
  - User goal
outputs:
  - Product spec
tools:
  - local files
handoff_to:
  - qa-reviewer
---

Body
`,
  );
  await write(
    path.join(root, "agent-team/employees/quality/qa-reviewer.md"),
    `---
id: qa-reviewer
name: QA Reviewer
role: quality/qa-reviewer
responsibilities:
  - Review quality
inputs:
  - Plan
outputs:
  - Quality plan
tools:
  - local files
handoff_to:
  - product-manager
---

Body
`,
  );
  await write(
    path.join(root, "agent-team/skills/product/requirement-analysis.md"),
    "# Skill: Requirement Analysis\n",
  );
  await write(
    path.join(root, "agent-team/skills/quality/quality-review.md"),
    "# Skill: Quality Review\n",
  );
  await write(
    path.join(root, "agent-team/teams/product/product-development-squad.yaml"),
    `id: product-development-squad
name: Product Development Squad
members:
  lead: product-manager
  contributors:
    - qa-reviewer
default_workflows:
  - new-product-mvp
`,
  );
  await write(
    path.join(root, "agent-team/agency/divisions/product.yaml"),
    `id: product
employees:
  - product-manager
teams:
  - product-development-squad
`,
  );
  await write(
    path.join(root, "agent-team/workflows/product/new-product-mvp.yaml"),
    `name: new-product-mvp
description: Test workflow
team: product-development-squad
inputs:
  - name: idea
    required: true
steps:
  - id: product_spec
    employee: product-manager
    skill: requirement-analysis
    task: "Write spec for {{idea}}"
    output: product_spec
  - id: quality_plan
    employee: qa-reviewer
    skill: quality-review
    depends_on:
      - product_spec
    task: "Review {{product_spec}}"
    output: quality_plan
`,
  );

  return root;
}

test("loadRegistry reads employees, skills, teams, workflows, and divisions", async () => {
  const root = await createFixture();
  const registry = await loadRegistry(root);

  assert.equal(registry.employees.get("product-manager").name, "Product Manager");
  assert.equal(registry.skills.get("quality-review").id, "quality-review");
  assert.equal(registry.teams.get("product-development-squad").members.length, 2);
  assert.equal(registry.workflows.get("new-product-mvp").steps.length, 2);
  assert.equal(registry.divisions.get("product").teams[0], "product-development-squad");
});

test("validateRegistry rejects unavailable template variables", async () => {
  const root = await createFixture();
  const workflowPath = path.join(root, "agent-team/workflows/product/new-product-mvp.yaml");
  await write(
    workflowPath,
    `name: new-product-mvp
team: product-development-squad
inputs:
  - name: idea
    required: true
steps:
  - id: product_spec
    employee: product-manager
    skill: requirement-analysis
    task: "Write {{missing_var}}"
    output: product_spec
`,
  );

  const registry = await loadRegistry(root);
  const result = validateRegistry(registry);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /references unavailable variable: missing_var/);
});

