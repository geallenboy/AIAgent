import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("Codex and Claude skills exist with agent-team trigger guidance", async () => {
  const codexSkill = await readFile(
    path.join(root, ".agents/skills/agent-team/SKILL.md"),
    "utf8",
  );
  const claudeSkill = await readFile(
    path.join(root, ".claude/skills/agent-team/SKILL.md"),
    "utf8",
  );

  assert.match(codexSkill, /^---\nname: agent-team/m);
  assert.match(codexSkill, /MCP/i);
  assert.match(codexSkill, /create_run/);
  assert.match(claudeSkill, /^---\n/);
  assert.match(claudeSkill, /\/agent-team/);
  assert.match(claudeSkill, /MCP/i);
});

test("Agent-native config examples point at the MCP CLI entry", async () => {
  const codexConfig = await readFile(
    path.join(root, ".codex/config.agent-team.example.toml"),
    "utf8",
  );
  const claudeConfig = await readFile(path.join(root, ".mcp.example.json"), "utf8");
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

  assert.match(codexConfig, /\[mcp_servers\.agent_team\]/);
  assert.match(codexConfig, /src\/agent-team\/cli\.js/);
  assert.match(codexConfig, /mcp/);
  assert.match(claudeConfig, /agent-team/);
  assert.match(claudeConfig, /src\/agent-team\/cli\.js/);
  assert.match(claudeConfig, /mcp/);
  assert.equal(packageJson.scripts.mcp, "node src/agent-team/cli.js mcp");
});

