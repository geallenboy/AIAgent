import { appendFile, copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { ensureDir, exists, readJson, readText, writeJson } from "./fs-utils.js";
import { inferPermissionRequests, needsApproval } from "./permissions.js";
import { renderTemplate } from "./parsers.js";

const RUNTIME_DIR = ".agent-team/runtime";

function timestamp() {
  return new Date().toISOString();
}

function newId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

function runDir(root, runId) {
  return path.join(root, RUNTIME_DIR, "runs", runId);
}

function runFile(root, runId) {
  return path.join(runDir(root, runId), "run.json");
}

function eventsFile(root, runId) {
  return path.join(runDir(root, runId), "events.jsonl");
}

async function appendEvent(root, runId, type, payload = {}, stepId = null) {
  const event = {
    id: newId("evt"),
    runId,
    stepId,
    type,
    timestamp: timestamp(),
    payload,
  };
  await appendFile(eventsFile(root, runId), `${JSON.stringify(event)}\n`);
  return event;
}

function variablesForStep(run, workflow, targetStep) {
  const variables = { ...run.inputs };
  for (const step of workflow.steps) {
    const stepRun = run.steps.find((candidate) => candidate.stepId === step.id);
    if (!stepRun || !targetStep.depends_on.includes(step.id)) {
      continue;
    }
    if (step.output && stepRun.outputContent) {
      variables[step.output] = stepRun.outputContent;
    }
  }
  return variables;
}

function buildPrompt(registry, workflow, step, variables) {
  const employee = registry.employees.get(step.employee);
  const skill = registry.skills.get(step.skill);
  const renderedTask = renderTemplate(step.task, variables);

  return [
    `# Agent Team Step: ${step.id}`,
    "",
    `Employee: ${employee?.name ?? step.employee} (${step.employee})`,
    `Role: ${employee?.role ?? "unknown"}`,
    `Skill: ${step.skill}`,
    "",
    "## Task",
    renderedTask,
    "",
    "## Employee Responsibilities",
    ...(employee?.responsibilities ?? []).map((item) => `- ${item}`),
    "",
    "## Skill Method",
    skill?.content?.trim() ?? "",
    "",
    "## Output",
    `Return Markdown for workflow output \`${step.output}\`.`,
  ].join("\n");
}

async function writeStepPrompt(root, runId, stepId, prompt) {
  const filePath = path.join(runDir(root, runId), "step-prompts", `${stepId}.md`);
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, prompt);
  return path.relative(runDir(root, runId), filePath);
}

function applyReadiness(root, registry, workflow, run, stepRun) {
  const step = workflow.steps.find((candidate) => candidate.id === stepRun.stepId);
  const employee = registry.employees.get(step.employee);
  stepRun.prompt = buildPrompt(registry, workflow, step, variablesForStep(run, workflow, step));
  stepRun.permissionRequests = stepRun.permissionRequests?.length
    ? stepRun.permissionRequests
    : inferPermissionRequests(employee, step, run.inputs);
  stepRun.status = needsApproval(stepRun.permissionRequests) ? "waiting_approval" : "ready";
}

async function saveRun(root, run) {
  run.updatedAt = timestamp();
  await writeJson(runFile(root, run.id), run);
}

async function advanceRun(root, registry, run) {
  const workflow = registry.workflows.get(run.workflowId);

  for (const stepRun of run.steps) {
    if (stepRun.status !== "pending") {
      continue;
    }
    const dependenciesSucceeded = stepRun.dependencies.every((dependency) => {
      return run.steps.find((step) => step.stepId === dependency)?.status === "succeeded";
    });
    if (!dependenciesSucceeded) {
      continue;
    }

    applyReadiness(root, registry, workflow, run, stepRun);
    stepRun.promptPath = await writeStepPrompt(root, run.id, stepRun.stepId, stepRun.prompt);
    await appendEvent(root, run.id, `step.${stepRun.status}`, { status: stepRun.status }, stepRun.stepId);
  }

  if (run.steps.every((step) => step.status === "succeeded")) {
    run.status = "succeeded";
    await appendEvent(root, run.id, "run.succeeded");
  }
}

export async function createRun(root, registry, workflowId, inputs = {}) {
  const workflow = registry.workflows.get(workflowId);
  if (!workflow) {
    throw new Error(`Unknown workflow: ${workflowId}`);
  }

  for (const input of workflow.inputs) {
    if (input.required && !(input.name in inputs)) {
      throw new Error(`Missing required input: ${input.name}`);
    }
  }

  const now = timestamp();
  const run = {
    id: newId("run"),
    workflowId,
    teamId: workflow.team,
    inputs,
    status: "running",
    createdAt: now,
    updatedAt: now,
    steps: workflow.steps.map((step) => ({
      stepId: step.id,
      employee: step.employee,
      skill: step.skill,
      status: "pending",
      dependencies: step.depends_on,
      outputName: step.output,
      artifactIds: [],
      permissionRequests: [],
      prompt: "",
      promptPath: null,
      outputContent: "",
    })),
  };

  await mkdir(path.join(runDir(root, run.id), "artifacts"), { recursive: true });
  await mkdir(path.join(runDir(root, run.id), "step-prompts"), { recursive: true });
  await writeFile(eventsFile(root, run.id), "");
  await appendEvent(root, run.id, "run.created", { workflowId, teamId: workflow.team });

  await advanceRun(root, registry, run);
  await saveRun(root, run);
  return run;
}

export async function getRun(root, runId) {
  return readJson(runFile(root, runId));
}

export async function listRuns(root) {
  const dir = path.join(root, RUNTIME_DIR, "runs");
  if (!(await exists(dir))) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  const runs = [];
  for (const entry of entries) {
    if (entry.isDirectory() && (await exists(runFile(root, entry.name)))) {
      runs.push(await getRun(root, entry.name));
    }
  }
  return runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listEvents(root, runId) {
  const filePath = eventsFile(root, runId);
  if (!(await exists(filePath))) {
    return [];
  }
  const text = await readText(filePath);
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export async function listReadySteps(root, runId) {
  const run = await getRun(root, runId);
  return run.steps.filter((step) => ["ready", "waiting_approval"].includes(step.status));
}

export async function getStepPrompt(root, runId, stepId) {
  const run = await getRun(root, runId);
  const step = run.steps.find((candidate) => candidate.stepId === stepId);
  if (!step) {
    throw new Error(`Unknown step: ${stepId}`);
  }
  return {
    runId,
    stepId,
    status: step.status,
    employee: step.employee,
    skill: step.skill,
    dependencies: step.dependencies,
    outputName: step.outputName,
    permissionRequests: step.permissionRequests,
    artifactIds: step.artifactIds,
    promptPath: step.promptPath,
    prompt: step.prompt,
  };
}

export async function submitStepOutput(root, registry, runId, stepId, outputFile) {
  const run = await getRun(root, runId);
  const stepRun = run.steps.find((step) => step.stepId === stepId);
  if (!stepRun) {
    throw new Error(`Unknown step: ${stepId}`);
  }
  if (!["ready", "running", "waiting_approval"].includes(stepRun.status)) {
    throw new Error(`Step ${stepId} cannot accept output while ${stepRun.status}`);
  }

  const artifactId = `${stepId}-${Date.now()}.md`;
  const artifactPath = path.join(runDir(root, runId), "artifacts", artifactId);
  await copyFile(outputFile, artifactPath);

  stepRun.status = "succeeded";
  stepRun.outputContent = await readText(outputFile);
  stepRun.artifactIds.push(artifactId);
  await appendEvent(root, runId, "step.output_submitted", { artifactId }, stepId);
  await appendEvent(root, runId, "step.succeeded", {}, stepId);

  await advanceRun(root, registry, run);
  await saveRun(root, run);
  return run;
}

export async function submitStepContent(root, registry, runId, stepId, content) {
  const tempDir = path.join(runDir(root, runId), "tmp");
  await ensureDir(tempDir);
  const tempFile = path.join(tempDir, `${stepId}-output.md`);
  await writeFile(tempFile, content);
  return submitStepOutput(root, registry, runId, stepId, tempFile);
}

export async function approveStep(root, registry, runId, stepId, capability = null) {
  const run = await getRun(root, runId);
  const workflow = registry.workflows.get(run.workflowId);
  const stepRun = run.steps.find((step) => step.stepId === stepId);
  if (!stepRun) {
    throw new Error(`Unknown step: ${stepId}`);
  }

  const now = timestamp();
  for (const request of stepRun.permissionRequests) {
    if (!capability || request.capability === capability) {
      request.status = "approved";
      request.approvedAt = now;
      await appendEvent(root, runId, "permission.approved", { capability: request.capability }, stepId);
    }
  }

  const dependenciesSucceeded = stepRun.dependencies.every((dependency) => {
    return run.steps.find((step) => step.stepId === dependency)?.status === "succeeded";
  });
  if (dependenciesSucceeded && !needsApproval(stepRun.permissionRequests)) {
    const step = workflow.steps.find((candidate) => candidate.id === stepRun.stepId);
    stepRun.prompt = buildPrompt(registry, workflow, step, variablesForStep(run, workflow, step));
    stepRun.promptPath = await writeStepPrompt(root, run.id, stepRun.stepId, stepRun.prompt);
    stepRun.status = "ready";
    await appendEvent(root, runId, "step.ready", {}, stepId);
  }

  await saveRun(root, run);
  return run;
}

export async function cancelRun(root, runId) {
  const run = await getRun(root, runId);
  run.status = "cancelled";
  for (const step of run.steps) {
    if (["pending", "ready", "waiting_approval", "running"].includes(step.status)) {
      step.status = "cancelled";
    }
  }
  await appendEvent(root, runId, "run.cancelled");
  await saveRun(root, run);
  return run;
}
