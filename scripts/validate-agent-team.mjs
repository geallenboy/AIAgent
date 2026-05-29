import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const agentTeamDir = path.join(root, "agent-team");
const requiredDirs = ["agency", "employees", "skills", "teams", "tasks", "workflows"];
const requiredEmployeeKeys = [
  "id",
  "name",
  "role",
  "responsibilities",
  "inputs",
  "outputs",
  "tools",
  "handoff_to",
];

const errors = [];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readDirFiles(dir, extension) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readDirFiles(entryPath, extension)));
    }
    if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function parseFrontmatter(markdown, filePath) {
  if (!markdown.startsWith("---\n")) {
    errors.push(`${filePath} is missing frontmatter`);
    return {};
  }

  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) {
    errors.push(`${filePath} has unterminated frontmatter`);
    return {};
  }

  const body = markdown.slice(4, end);
  const data = {};
  let currentKey = null;

  for (const line of body.split("\n")) {
    const keyValue = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    const listValue = line.match(/^\s{2}-\s+(.+)$/);

    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2] ?? "";
      data[currentKey] = value === "" ? [] : value.trim();
      continue;
    }

    if (listValue && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [data[currentKey]];
      }
      data[currentKey].push(listValue[1].trim());
    }
  }

  return data;
}

function parseWorkflow(text) {
  const workflow = {
    name: null,
    team: null,
    steps: [],
  };
  let inSteps = false;
  let currentStep = null;
  let currentStepListKey = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/\s+$/, "");

    if (line.startsWith("name: ")) {
      workflow.name = line.slice("name: ".length).trim();
      continue;
    }

    if (line.startsWith("team: ")) {
      workflow.team = line.slice("team: ".length).trim();
      continue;
    }

    if (line === "steps:") {
      inSteps = true;
      continue;
    }

    if (!inSteps) {
      continue;
    }

    const stepStart = line.match(/^  - id:\s+(.+)$/);
    if (stepStart) {
      currentStep = {
        id: stepStart[1].trim(),
        employee: null,
        skill: null,
        depends_on: [],
        output: null,
        task: "",
      };
      workflow.steps.push(currentStep);
      currentStepListKey = null;
      continue;
    }

    if (!currentStep) {
      continue;
    }

    const property = line.match(/^    ([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    if (property) {
      const key = property[1];
      const value = property[2] ?? "";
      currentStepListKey = value === "" ? key : null;
      if (key === "employee" || key === "skill" || key === "output") {
        currentStep[key] = value.trim();
      }
      if (key === "task") {
        currentStep.task = value.trim();
      }
      if (key === "depends_on" && value.trim().startsWith("[")) {
        currentStep.depends_on = value
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      continue;
    }

    const listItem = line.match(/^      -\s+(.+)$/);
    if (listItem && currentStepListKey === "depends_on") {
      currentStep.depends_on.push(listItem[1].trim());
      continue;
    }

    if (line.startsWith("    ") && currentStep.task) {
      currentStep.task += `\n${line.trim()}`;
    }
  }

  return workflow;
}

function parseTeam(text) {
  const team = {
    id: null,
    members: [],
    default_workflows: [],
  };
  let inMembers = false;
  let inContributors = false;
  let inDefaultWorkflows = false;

  for (const line of text.split("\n")) {
    const topLevelKey = line.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (topLevelKey && topLevelKey[1] !== "id") {
      inMembers = topLevelKey[1] === "members";
      inContributors = false;
      inDefaultWorkflows = topLevelKey[1] === "default_workflows";
    }

    if (line.startsWith("id: ")) {
      team.id = line.slice("id: ".length).trim();
      continue;
    }

    if (line === "members:") {
      inMembers = true;
      inContributors = false;
      inDefaultWorkflows = false;
      continue;
    }

    if (line === "default_workflows:") {
      inMembers = false;
      inContributors = false;
      inDefaultWorkflows = true;
      continue;
    }

    if (inMembers && line.match(/^  lead:\s+/)) {
      team.members.push(line.replace(/^  lead:\s+/, "").trim());
      continue;
    }

    if (inMembers && line === "  contributors:") {
      inContributors = true;
      continue;
    }

    const nestedItem = line.match(/^    -\s+(.+)$/);
    if (inContributors && nestedItem) {
      team.members.push(nestedItem[1].trim());
      continue;
    }

    const topLevelItem = line.match(/^  -\s+(.+)$/);
    if (inDefaultWorkflows && topLevelItem) {
      team.default_workflows.push(topLevelItem[1].trim());
    }
  }

  return team;
}

function parseDivision(text) {
  const division = {
    id: null,
    employees: [],
    teams: [],
  };
  let currentList = null;

  for (const line of text.split("\n")) {
    if (line.startsWith("id: ")) {
      division.id = line.slice("id: ".length).trim();
      currentList = null;
      continue;
    }

    const topLevelKey = line.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (topLevelKey) {
      currentList = ["employees", "teams"].includes(topLevelKey[1])
        ? topLevelKey[1]
        : null;
      continue;
    }

    const item = line.match(/^  -\s+(.+)$/);
    if (item && currentList) {
      division[currentList].push(item[1].trim());
    }
  }

  return division;
}

function collectTemplateVariables(text) {
  return [...text.matchAll(/\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/g)].map(
    (match) => match[1],
  );
}

async function main() {
  for (const dir of requiredDirs) {
    const fullPath = path.join(agentTeamDir, dir);
    if (!(await exists(fullPath))) {
      errors.push(`Missing required directory: agent-team/${dir}`);
    }
  }

  const employeeFiles = await readDirFiles(path.join(agentTeamDir, "employees"), ".md");
  const skillFiles = await readDirFiles(path.join(agentTeamDir, "skills"), ".md");
  const teamFiles = await readDirFiles(path.join(agentTeamDir, "teams"), ".yaml");
  const workflowFiles = await readDirFiles(path.join(agentTeamDir, "workflows"), ".yaml");
  const divisionFiles = await readDirFiles(
    path.join(agentTeamDir, "agency", "divisions"),
    ".yaml",
  );

  const employees = new Set();
  const skills = new Set(skillFiles.map((file) => path.basename(file, ".md")));
  const teams = new Set();
  const workflows = new Set();

  for (const file of employeeFiles) {
    const text = await readFile(file, "utf8");
    const frontmatter = parseFrontmatter(text, path.relative(root, file));
    for (const key of requiredEmployeeKeys) {
      if (!(key in frontmatter)) {
        errors.push(`${path.relative(root, file)} is missing frontmatter key: ${key}`);
      }
    }
    if (frontmatter.id) {
      employees.add(frontmatter.id);
    }
  }

  const parsedWorkflows = [];
  for (const file of workflowFiles) {
    const text = await readFile(file, "utf8");
    const workflow = parseWorkflow(text);
    const workflowId = path.basename(file, ".yaml");
    workflows.add(workflowId);
    parsedWorkflows.push({ file, workflow, text });
  }

  for (const file of teamFiles) {
    const text = await readFile(file, "utf8");
    const team = parseTeam(text);
    const relative = path.relative(root, file);
    if (!team.id) {
      errors.push(`${relative} is missing id`);
    } else {
      teams.add(team.id);
    }
    for (const member of team.members) {
      if (!employees.has(member)) {
        errors.push(`${relative} references missing employee: ${member}`);
      }
    }
    for (const workflow of team.default_workflows) {
      if (!workflows.has(workflow)) {
        errors.push(`${relative} references missing workflow: ${workflow}`);
      }
    }
  }

  for (const file of divisionFiles) {
    const text = await readFile(file, "utf8");
    const division = parseDivision(text);
    const relative = path.relative(root, file);
    if (!division.id) {
      errors.push(`${relative} is missing id`);
    }
    for (const employee of division.employees) {
      if (!employees.has(employee)) {
        errors.push(`${relative} references missing employee: ${employee}`);
      }
    }
    for (const team of division.teams) {
      if (!teams.has(team)) {
        errors.push(`${relative} references missing team: ${team}`);
      }
    }
  }

  for (const { file, workflow, text } of parsedWorkflows) {
    const relative = path.relative(root, file);
    const inputNames = new Set(
      [...text.matchAll(/^\s+- name:\s+([A-Za-z_][A-Za-z0-9_]*)$/gm)].map(
        (match) => match[1],
      ),
    );
    const stepIds = new Set(workflow.steps.map((step) => step.id));
    const outputs = new Set(workflow.steps.map((step) => step.output).filter(Boolean));

    if (!workflow.name) {
      errors.push(`${relative} is missing name`);
    }
    if (!teams.has(workflow.team)) {
      errors.push(`${relative} references missing team: ${workflow.team}`);
    }
    if (workflow.steps.length === 0) {
      errors.push(`${relative} has no steps`);
    }

    for (const step of workflow.steps) {
      if (!employees.has(step.employee)) {
        errors.push(`${relative} step ${step.id} references missing employee: ${step.employee}`);
      }
      if (!skills.has(step.skill)) {
        errors.push(`${relative} step ${step.id} references missing skill: ${step.skill}`);
      }
      if (!step.output) {
        errors.push(`${relative} step ${step.id} is missing output`);
      }
      for (const dependency of step.depends_on) {
        if (!stepIds.has(dependency)) {
          errors.push(`${relative} step ${step.id} depends on missing step: ${dependency}`);
        }
      }

      const availableVariables = new Set([...inputNames]);
      for (const candidate of workflow.steps) {
        if (step.depends_on.includes(candidate.id) && candidate.output) {
          availableVariables.add(candidate.output);
        }
      }
      for (const variable of collectTemplateVariables(step.task)) {
        if (!availableVariables.has(variable)) {
          errors.push(`${relative} step ${step.id} references unavailable variable: ${variable}`);
        }
      }
    }

    if (outputs.size !== workflow.steps.length) {
      errors.push(`${relative} has duplicate or missing step outputs`);
    }
  }

  if (errors.length > 0) {
    console.error("Agent Team validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Agent Team validation passed.");
  console.log(`Employees: ${employees.size}`);
  console.log(`Skills: ${skills.size}`);
  console.log(`Teams: ${teams.size}`);
  console.log(`Workflows: ${workflows.size}`);
  console.log(`Divisions: ${divisionFiles.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
