#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { invokeAgentTeamTool } from "./mcp-tools.js";

function mcpResponse(result) {
  return {
    content: [
      {
        type: "text",
        text: `${result.summary}\n\n${JSON.stringify(result.data, null, 2)}`,
      },
    ],
    structuredContent: result,
  };
}

function registerAgentTeamTool(server, root, name, description, inputSchema) {
  server.registerTool(
    name,
    {
      description,
      inputSchema,
    },
    async (args) => mcpResponse(await invokeAgentTeamTool(root, name, args)),
  );
}

export function createAgentTeamMcpServer({ root = process.cwd() } = {}) {
  const server = new McpServer(
    {
      name: "agent-team",
      version: "0.1.0",
    },
    {
      instructions:
        "Use Agent Team tools to route work through local employees, skills, teams, and workflows. Query workflows first, create a run, then execute ready step prompts and submit Markdown output. Do not bypass approval-waiting steps.",
    },
  );

  registerAgentTeamTool(server, root, "list_workflows", "List available Agent Team workflows.", {});
  registerAgentTeamTool(server, root, "describe_workflow", "Describe one Agent Team workflow.", {
    workflowId: z.string().describe("Workflow id, such as new-product-mvp"),
  });
  registerAgentTeamTool(server, root, "create_run", "Create a local Agent Team workflow run.", {
    workflowId: z.string().describe("Workflow id to run"),
    inputs: z.record(z.string(), z.unknown()).optional().describe("Workflow input values"),
  });
  registerAgentTeamTool(server, root, "list_runs", "List local Agent Team workflow runs.", {});
  registerAgentTeamTool(server, root, "get_run", "Read one Agent Team run.", {
    runId: z.string().describe("Run id"),
  });
  registerAgentTeamTool(server, root, "get_next_action", "Suggest the next safe Agent Team action for a run.", {
    runId: z.string().describe("Run id"),
  });
  registerAgentTeamTool(server, root, "list_ready_steps", "List ready or approval-waiting steps for a run.", {
    runId: z.string().describe("Run id"),
  });
  registerAgentTeamTool(server, root, "get_step_prompt", "Read the generated prompt for one step.", {
    runId: z.string().describe("Run id"),
    stepId: z.string().describe("Step id"),
  });
  registerAgentTeamTool(server, root, "approve_step", "Approve a pending capability request for a step.", {
    runId: z.string().describe("Run id"),
    stepId: z.string().describe("Step id"),
    capability: z.string().optional().describe("Capability to approve; omit to approve all pending capabilities"),
  });
  registerAgentTeamTool(server, root, "submit_step_output", "Submit Markdown output for a manual step.", {
    runId: z.string().describe("Run id"),
    stepId: z.string().describe("Step id"),
    content: z.string().describe("Markdown output for this step"),
  });
  registerAgentTeamTool(server, root, "list_events", "List audit events for a run.", {
    runId: z.string().describe("Run id"),
  });
  registerAgentTeamTool(server, root, "cancel_run", "Cancel a local Agent Team run.", {
    runId: z.string().describe("Run id"),
  });

  return server;
}

export async function startAgentTeamMcpServer({ root = process.cwd() } = {}) {
  const server = createAgentTeamMcpServer({ root });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startAgentTeamMcpServer().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exit(1);
  });
}
