#!/usr/bin/env node
import { readFile } from "node:fs/promises";

import { loadRegistry, serializeRegistry, validateRegistry } from "./registry.js";
import {
  approveStep,
  createRun,
  getRun,
  listEvents,
  listRuns,
  submitStepOutput,
} from "./runtime.js";
import { serve } from "./server.js";
import { startAgentTeamMcpServer } from "./mcp-server.js";

function parseInputs(args) {
  const inputs = {};
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== "--input") {
      continue;
    }
    const [key, ...valueParts] = (args[index + 1] ?? "").split("=");
    inputs[key] = valueParts.join("=");
    index += 1;
  }
  return inputs;
}

function parsePort(args) {
  const index = args.indexOf("--port");
  if (index === -1) {
    return 4173;
  }
  return Number(args[index + 1]);
}

function print(value) {
  process.stdout.write(`${typeof value === "string" ? value : JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const root = process.cwd();

  if (!command || command === "help") {
    print(`Usage:
  agent-team validate
  agent-team registry
  agent-team run <workflow-id> --input key=value
  agent-team runs
  agent-team status <run-id>
  agent-team events <run-id>
  agent-team approve <run-id> <step-id> [capability]
  agent-team submit-output <run-id> <step-id> <file>
  agent-team mcp
  agent-team serve [--port 4173]`);
    return;
  }

  const registry = await loadRegistry(root);

  if (command === "validate") {
    const result = validateRegistry(registry);
    if (!result.ok) {
      print("Agent Team validation failed:");
      for (const error of result.errors) {
        print(`- ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    print("Agent Team validation passed.");
    print(`Employees: ${registry.employees.size}`);
    print(`Skills: ${registry.skills.size}`);
    print(`Teams: ${registry.teams.size}`);
    print(`Workflows: ${registry.workflows.size}`);
    print(`Divisions: ${registry.divisions.size}`);
    return;
  }

  if (command === "registry") {
    print(serializeRegistry(registry));
    return;
  }

  if (command === "run") {
    const workflowId = args[0];
    const run = await createRun(root, registry, workflowId, parseInputs(args.slice(1)));
    print(run);
    return;
  }

  if (command === "runs") {
    print(await listRuns(root));
    return;
  }

  if (command === "status") {
    print(await getRun(root, args[0]));
    return;
  }

  if (command === "events") {
    print(await listEvents(root, args[0]));
    return;
  }

  if (command === "approve") {
    print(await approveStep(root, registry, args[0], args[1], args[2] ?? null));
    return;
  }

  if (command === "submit-output") {
    if (!args[2]) {
      throw new Error("submit-output requires <run-id> <step-id> <file>");
    }
    await readFile(args[2], "utf8");
    print(await submitStepOutput(root, registry, args[0], args[1], args[2]));
    return;
  }

  if (command === "mcp") {
    await startAgentTeamMcpServer({ root });
    return;
  }

  if (command === "serve") {
    const port = parsePort(args);
    await serve({ root, port });
    print(`Agent Team Workbench running at http://127.0.0.1:${port}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
