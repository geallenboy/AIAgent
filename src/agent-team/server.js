import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadRegistry, serializeRegistry, validateRegistry } from "./registry.js";
import {
  approveStep,
  cancelRun,
  createRun,
  getRun,
  listEvents,
  listRuns,
  submitStepContent,
} from "./runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, "workbench");

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function sendJson(res, status, value) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value, null, 2));
}

function sendError(res, error) {
  sendJson(res, 400, { error: error.message });
}

export async function handleApiRequest(root, method, pathname, body = {}) {
  const registry = await loadRegistry(root);

  if (method === "GET" && pathname === "/api/registry") {
    const validation = validateRegistry(registry);
    return {
      status: validation.ok ? 200 : 422,
      body: {
        ...serializeRegistry(registry),
        validation,
      },
    };
  }

  if (method === "GET" && pathname === "/api/runs") {
    return { status: 200, body: await listRuns(root) };
  }

  if (method === "POST" && pathname === "/api/runs") {
    return {
      status: 201,
      body: await createRun(root, registry, body.workflowId, body.inputs ?? {}),
    };
  }

  const runMatch = pathname.match(/^\/api\/runs\/([^/]+)$/);
  if (method === "GET" && runMatch) {
    return { status: 200, body: await getRun(root, runMatch[1]) };
  }

  const eventsMatch = pathname.match(/^\/api\/runs\/([^/]+)\/events$/);
  if (method === "GET" && eventsMatch) {
    return { status: 200, body: await listEvents(root, eventsMatch[1]) };
  }

  const startMatch = pathname.match(/^\/api\/runs\/([^/]+)\/start$/);
  if (method === "POST" && startMatch) {
    return { status: 200, body: await getRun(root, startMatch[1]) };
  }

  const cancelMatch = pathname.match(/^\/api\/runs\/([^/]+)\/cancel$/);
  if (method === "POST" && cancelMatch) {
    return { status: 200, body: await cancelRun(root, cancelMatch[1]) };
  }

  const approveMatch = pathname.match(/^\/api\/runs\/([^/]+)\/steps\/([^/]+)\/approve$/);
  if (method === "POST" && approveMatch) {
    return {
      status: 200,
      body: await approveStep(root, registry, approveMatch[1], approveMatch[2], body.capability ?? null),
    };
  }

  const outputMatch = pathname.match(/^\/api\/runs\/([^/]+)\/steps\/([^/]+)\/output$/);
  if (method === "POST" && outputMatch) {
    return {
      status: 200,
      body: await submitStepContent(root, registry, outputMatch[1], outputMatch[2], body.content ?? ""),
    };
  }

  return { status: 404, body: { error: "Not found" } };
}

async function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(STATIC_DIR, pathname);
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };
  try {
    await readFile(filePath);
    res.writeHead(200, { "content-type": types[path.extname(filePath)] ?? "text/plain" });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

export function createServer({ root = process.cwd() } = {}) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/")) {
      await serveStatic(req, res);
      return;
    }

    try {
      const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await readBody(req) : {};
      const result = await handleApiRequest(root, req.method, url.pathname, body);
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendError(res, error);
    }
  });
}

export async function serve({ root = process.cwd(), port = 4173 } = {}) {
  const server = createServer({ root });
  await new Promise((resolve) => server.listen(port, resolve));
  return server;
}
