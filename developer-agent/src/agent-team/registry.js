import path from "node:path";

import { readDirFiles, readText } from "./fs-utils.js";
import {
  collectTemplateVariables,
  parseDivision,
  parseFrontmatter,
  parseTeam,
  parseWorkflow,
} from "./parsers.js";

const REQUIRED_EMPLOYEE_KEYS = [
  "id",
  "name",
  "role",
  "responsibilities",
  "inputs",
  "outputs",
  "tools",
  "handoff_to",
];

function relative(root, filePath) {
  return path.relative(root, filePath);
}

export async function loadRegistry(root = process.cwd()) {
  const agentTeamDir = path.join(root, "agent-team");
  const employeeFiles = await readDirFiles(path.join(agentTeamDir, "employees"), ".md");
  const skillFiles = await readDirFiles(path.join(agentTeamDir, "skills"), ".md");
  const teamFiles = await readDirFiles(path.join(agentTeamDir, "teams"), ".yaml");
  const workflowFiles = await readDirFiles(path.join(agentTeamDir, "workflows"), ".yaml");
  const divisionFiles = await readDirFiles(
    path.join(agentTeamDir, "agency", "divisions"),
    ".yaml",
  );

  const registry = {
    root,
    employees: new Map(),
    skills: new Map(),
    teams: new Map(),
    workflows: new Map(),
    divisions: new Map(),
    files: {
      employees: employeeFiles,
      skills: skillFiles,
      teams: teamFiles,
      workflows: workflowFiles,
      divisions: divisionFiles,
    },
  };

  for (const file of employeeFiles) {
    const { data, content } = parseFrontmatter(await readText(file), relative(root, file));
    registry.employees.set(data.id, {
      ...data,
      content,
      file: relative(root, file),
    });
  }

  for (const file of skillFiles) {
    const id = path.basename(file, ".md");
    registry.skills.set(id, {
      id,
      content: await readText(file),
      file: relative(root, file),
    });
  }

  for (const file of teamFiles) {
    const fallbackId = path.basename(file, ".yaml");
    const team = parseTeam(await readText(file), fallbackId);
    team.file = relative(root, file);
    registry.teams.set(team.id, team);
  }

  for (const file of workflowFiles) {
    const id = path.basename(file, ".yaml");
    const workflow = parseWorkflow(await readText(file), id);
    workflow.file = relative(root, file);
    registry.workflows.set(workflow.id, workflow);
  }

  for (const file of divisionFiles) {
    const fallbackId = path.basename(file, ".yaml");
    const division = parseDivision(await readText(file), fallbackId);
    division.file = relative(root, file);
    registry.divisions.set(division.id, division);
  }

  return registry;
}

export function validateRegistry(registry) {
  const errors = [];

  for (const [id, employee] of registry.employees) {
    if (!id) {
      errors.push(`${employee.file} is missing employee id`);
    }
    for (const key of REQUIRED_EMPLOYEE_KEYS) {
      if (!(key in employee)) {
        errors.push(`${employee.file} is missing frontmatter key: ${key}`);
      }
    }
  }

  for (const [, team] of registry.teams) {
    if (!team.id) {
      errors.push(`${team.file} is missing id`);
    }
    for (const member of team.members) {
      if (!registry.employees.has(member)) {
        errors.push(`${team.file} references missing employee: ${member}`);
      }
    }
    for (const workflow of team.default_workflows) {
      if (!registry.workflows.has(workflow)) {
        errors.push(`${team.file} references missing workflow: ${workflow}`);
      }
    }
  }

  for (const [, division] of registry.divisions) {
    if (!division.id) {
      errors.push(`${division.file} is missing id`);
    }
    for (const employee of division.employees) {
      if (!registry.employees.has(employee)) {
        errors.push(`${division.file} references missing employee: ${employee}`);
      }
    }
    for (const team of division.teams) {
      if (!registry.teams.has(team)) {
        errors.push(`${division.file} references missing team: ${team}`);
      }
    }
  }

  for (const [, workflow] of registry.workflows) {
    const inputNames = new Set(workflow.inputs.map((input) => input.name));
    const stepIds = new Set(workflow.steps.map((step) => step.id));
    const outputs = new Set(workflow.steps.map((step) => step.output).filter(Boolean));

    if (!workflow.name) {
      errors.push(`${workflow.file} is missing name`);
    }
    if (!registry.teams.has(workflow.team)) {
      errors.push(`${workflow.file} references missing team: ${workflow.team}`);
    }
    if (workflow.steps.length === 0) {
      errors.push(`${workflow.file} has no steps`);
    }
    if (outputs.size !== workflow.steps.length) {
      errors.push(`${workflow.file} has duplicate or missing step outputs`);
    }

    for (const step of workflow.steps) {
      if (!registry.employees.has(step.employee)) {
        errors.push(`${workflow.file} step ${step.id} references missing employee: ${step.employee}`);
      }
      if (!registry.skills.has(step.skill)) {
        errors.push(`${workflow.file} step ${step.id} references missing skill: ${step.skill}`);
      }
      if (!step.output) {
        errors.push(`${workflow.file} step ${step.id} is missing output`);
      }
      for (const dependency of step.depends_on) {
        if (!stepIds.has(dependency)) {
          errors.push(`${workflow.file} step ${step.id} depends on missing step: ${dependency}`);
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
          errors.push(`${workflow.file} step ${step.id} references unavailable variable: ${variable}`);
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function serializeRegistry(registry) {
  const list = (map) => [...map.values()];
  return {
    employees: list(registry.employees).map(({ content, ...employee }) => employee),
    skills: list(registry.skills).map(({ content, ...skill }) => skill),
    teams: list(registry.teams),
    workflows: list(registry.workflows),
    divisions: list(registry.divisions),
  };
}

