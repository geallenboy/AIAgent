function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalar(value) {
  const stripped = stripQuotes(value);
  if (stripped === "true") return true;
  if (stripped === "false") return false;
  return stripped;
}

export function parseFrontmatter(markdown, filePath) {
  if (!markdown.startsWith("---\n")) {
    throw new Error(`${filePath} is missing frontmatter`);
  }

  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error(`${filePath} has unterminated frontmatter`);
  }

  const body = markdown.slice(4, end);
  const content = markdown.slice(end + "\n---\n".length);
  const data = {};
  let currentKey = null;

  for (const line of body.split("\n")) {
    const keyValue = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    const listValue = line.match(/^\s{2}-\s+(.+)$/);

    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2] ?? "";
      data[currentKey] = value === "" ? [] : stripQuotes(value);
      continue;
    }

    if (listValue && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [data[currentKey]];
      }
      data[currentKey].push(stripQuotes(listValue[1]));
    }
  }

  return { data, content };
}

export function parseWorkflow(text, id) {
  const workflow = {
    id,
    name: null,
    description: "",
    team: null,
    inputs: [],
    steps: [],
  };
  let section = null;
  let currentInput = null;
  let currentStep = null;
  let currentStepListKey = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/\s+$/, "");

    const top = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    if (top && !line.startsWith(" ")) {
      const [, key, rawValue = ""] = top;
      section = ["inputs", "steps"].includes(key) ? key : null;
      currentInput = null;
      currentStep = null;
      currentStepListKey = null;

      if (key === "name") workflow.name = stripQuotes(rawValue);
      if (key === "description") workflow.description = stripQuotes(rawValue);
      if (key === "team") workflow.team = stripQuotes(rawValue);
      continue;
    }

    if (section === "inputs") {
      const inputStart = line.match(/^  - name:\s+(.+)$/);
      if (inputStart) {
        currentInput = { name: stripQuotes(inputStart[1]), required: false };
        workflow.inputs.push(currentInput);
        continue;
      }

      const inputProperty = line.match(/^    ([A-Za-z_][A-Za-z0-9_]*):\s+(.+)$/);
      if (currentInput && inputProperty) {
        const [, key, value] = inputProperty;
        currentInput[key] = parseScalar(value);
        continue;
      }
    }

    if (section !== "steps") {
      continue;
    }

    const stepStart = line.match(/^  - id:\s+(.+)$/);
    if (stepStart) {
      currentStep = {
        id: stripQuotes(stepStart[1]),
        employee: null,
        skill: null,
        depends_on: [],
        task: "",
        output: null,
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

      if (["employee", "skill", "output"].includes(key)) {
        currentStep[key] = stripQuotes(value);
      }
      if (key === "task") {
        currentStep.task = stripQuotes(value);
      }
      if (key === "depends_on" && value.trim().startsWith("[")) {
        currentStep.depends_on = value
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((item) => stripQuotes(item))
          .filter(Boolean);
      }
      continue;
    }

    const listItem = line.match(/^      -\s+(.+)$/);
    if (listItem && currentStepListKey === "depends_on") {
      currentStep.depends_on.push(stripQuotes(listItem[1]));
      continue;
    }

    if (line.startsWith("    ") && currentStep.task) {
      currentStep.task += `\n${line.trim()}`;
    }
  }

  return workflow;
}

export function parseTeam(text, id) {
  const team = {
    id,
    name: id,
    description: "",
    use_when: [],
    members: [],
    default_workflows: [],
    deliverables: [],
  };
  let currentList = null;
  let inMembers = false;
  let inContributors = false;

  for (const line of text.split("\n")) {
    const top = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    if (top) {
      const [, key, value = ""] = top;
      currentList = value === "" ? key : null;
      inMembers = key === "members";
      inContributors = false;

      if (key === "id") team.id = stripQuotes(value);
      if (key === "name") team.name = stripQuotes(value);
      if (key === "description") team.description = stripQuotes(value);
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
      team.members.push(stripQuotes(nestedItem[1]));
      continue;
    }

    const item = line.match(/^  -\s+(.+)$/);
    if (item && Array.isArray(team[currentList])) {
      team[currentList].push(stripQuotes(item[1]));
    }
  }

  return team;
}

export function parseDivision(text, id) {
  const division = { id, employees: [], teams: [] };
  let currentList = null;

  for (const line of text.split("\n")) {
    const top = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    if (top) {
      const [, key, value = ""] = top;
      currentList = ["employees", "teams"].includes(key) ? key : null;
      if (key === "id") division.id = stripQuotes(value);
      continue;
    }

    const item = line.match(/^  -\s+(.+)$/);
    if (item && currentList) {
      division[currentList].push(stripQuotes(item[1]));
    }
  }

  return division;
}

export function collectTemplateVariables(text) {
  return [...text.matchAll(/\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/g)].map(
    (match) => match[1],
  );
}

export function renderTemplate(text, variables) {
  return text.replace(/\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/g, (_, key) => {
    return variables[key] ?? "";
  });
}
