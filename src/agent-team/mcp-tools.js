import { loadRegistry, serializeRegistry, validateRegistry } from "./registry.js";
import {
  approveStep,
  cancelRun,
  createRun,
  getRun,
  getStepPrompt,
  listEvents,
  listReadySteps,
  listRuns,
  submitStepContent,
} from "./runtime.js";

function ok(summary, data) {
  return { ok: true, summary, data };
}

function workflowSummary(workflow) {
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    team: workflow.team,
    inputs: workflow.inputs,
    stepCount: workflow.steps.length,
  };
}

function pendingPermissionRequests(step) {
  return (step.permissionRequests ?? []).filter((request) => request.status !== "approved");
}

async function withRegistry(root) {
  const registry = await loadRegistry(root);
  const validation = validateRegistry(registry);
  if (!validation.ok) {
    throw new Error(`Agent Team registry is invalid: ${validation.errors.join("; ")}`);
  }
  return registry;
}

export async function invokeAgentTeamTool(root, toolName, args = {}) {
  if (toolName === "list_workflows") {
    const registry = await withRegistry(root);
    const workflows = serializeRegistry(registry).workflows.map(workflowSummary);
    return ok(`Found ${workflows.length} workflows.`, { workflows });
  }

  if (toolName === "describe_workflow") {
    const registry = await withRegistry(root);
    const workflow = registry.workflows.get(args.workflowId);
    if (!workflow) {
      throw new Error(`Unknown workflow: ${args.workflowId}`);
    }
    return ok(`Workflow ${workflow.id} has ${workflow.steps.length} steps.`, { workflow });
  }

  if (toolName === "create_run") {
    const registry = await withRegistry(root);
    const run = await createRun(root, registry, args.workflowId, args.inputs ?? {});
    const readySteps = run.steps.filter((step) => ["ready", "waiting_approval"].includes(step.status));
    return ok(`Created run ${run.id} for ${run.workflowId}.`, { run, readySteps });
  }

  if (toolName === "list_runs") {
    const runs = await listRuns(root);
    return ok(`Found ${runs.length} runs.`, { runs });
  }

  if (toolName === "get_run") {
    const run = await getRun(root, args.runId);
    return ok(`Run ${run.id} is ${run.status}.`, { run });
  }

  if (toolName === "get_next_action") {
    const run = await getRun(root, args.runId);
    const activeSteps = run.steps.filter((step) => ["ready", "waiting_approval"].includes(step.status));
    const approvalStep = activeSteps.find((step) => step.status === "waiting_approval");
    if (approvalStep) {
      const requests = pendingPermissionRequests(approvalStep);
      return ok(`Step ${approvalStep.stepId} needs approval before it can run.`, {
        action: "approval_required",
        runId: run.id,
        runStatus: run.status,
        stepId: approvalStep.stepId,
        permissionRequests: requests,
        instruction:
          "Explain the pending capabilities and reasons to the user, then call approve_step only for approved capabilities.",
      });
    }

    const readyStep = activeSteps.find((step) => step.status === "ready");
    if (readyStep) {
      const step = await getStepPrompt(root, run.id, readyStep.stepId);
      return ok(`Step ${readyStep.stepId} is ready to execute.`, {
        action: "execute_step",
        runId: run.id,
        runStatus: run.status,
        stepId: readyStep.stepId,
        prompt: step.prompt,
        instruction:
          "Execute this prompt in the current agent turn, then call submit_step_output with concise Markdown output.",
      });
    }

    if (["succeeded", "failed", "cancelled"].includes(run.status)) {
      return ok(`Run ${run.id} is ${run.status}.`, {
        action: run.status,
        runId: run.id,
        runStatus: run.status,
        instruction: "Summarize the run result for the user.",
      });
    }

    return ok(`Run ${run.id} has no ready or approval-waiting steps.`, {
      action: "wait",
      runId: run.id,
      runStatus: run.status,
      instruction: "Inspect the run and events to determine whether it is blocked or waiting on dependencies.",
    });
  }

  if (toolName === "list_ready_steps") {
    const steps = await listReadySteps(root, args.runId);
    return ok(`Run ${args.runId} has ${steps.length} ready or approval-waiting steps.`, {
      steps,
    });
  }

  if (toolName === "get_step_prompt") {
    const step = await getStepPrompt(root, args.runId, args.stepId);
    return ok(`Step ${args.stepId} is ${step.status}.`, step);
  }

  if (toolName === "approve_step") {
    const registry = await withRegistry(root);
    const run = await approveStep(root, registry, args.runId, args.stepId, args.capability ?? null);
    return ok(`Approved ${args.capability ?? "all pending capabilities"} for ${args.stepId}.`, {
      run,
    });
  }

  if (toolName === "submit_step_output") {
    const registry = await withRegistry(root);
    const run = await submitStepContent(root, registry, args.runId, args.stepId, args.content ?? "");
    return ok(`Submitted output for ${args.stepId}.`, { run });
  }

  if (toolName === "list_events") {
    const events = await listEvents(root, args.runId);
    return ok(`Run ${args.runId} has ${events.length} events.`, { events });
  }

  if (toolName === "cancel_run") {
    const run = await cancelRun(root, args.runId);
    return ok(`Cancelled run ${run.id}.`, { run });
  }

  throw new Error(`Unknown Agent Team MCP tool: ${toolName}`);
}

export const AGENT_TEAM_TOOL_NAMES = [
  "list_workflows",
  "describe_workflow",
  "create_run",
  "list_runs",
  "get_run",
  "get_next_action",
  "list_ready_steps",
  "get_step_prompt",
  "approve_step",
  "submit_step_output",
  "list_events",
  "cancel_run",
];
