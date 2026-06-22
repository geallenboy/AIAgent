const state = {
  registry: null,
  runs: [],
  selectedRun: null,
  selectedStep: null,
  events: [],
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error ?? "Request failed");
  }
  return body;
}

function statusPill(status) {
  return `<span class="status ${status}">${status}</span>`;
}

function renderSummary() {
  const waiting = state.runs.flatMap((run) => run.steps).filter((step) => step.status === "waiting_approval").length;
  const active = state.runs.filter((run) => run.status === "running").length;
  const metrics = [
    ["Employees", state.registry?.employees.length ?? 0],
    ["Workflows", state.registry?.workflows.length ?? 0],
    ["Runs", state.runs.length],
    ["Active", active],
    ["Approvals", waiting],
  ];
  document.querySelector("#summary").innerHTML = metrics
    .map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
}

function renderLauncher() {
  const select = document.querySelector("#workflow-select");
  select.innerHTML = state.registry.workflows
    .map((workflow) => `<option value="${workflow.id}">${workflow.id} · ${workflow.team}</option>`)
    .join("");
  const first = state.registry.workflows[0];
  if (first) {
    const example = Object.fromEntries(first.inputs.map((input) => [input.name, ""]));
    document.querySelector("#inputs-text").value = JSON.stringify(example, null, 2);
  }
}

function renderRuns() {
  const runList = document.querySelector("#run-list");
  runList.innerHTML =
    state.runs
      .map(
        (run) => `<div class="run-item" data-run-id="${run.id}">
          <div><strong>${run.workflowId}</strong><br><span>${run.id}</span></div>
          <div>${statusPill(run.status)}</div>
        </div>`,
      )
      .join("") || `<div class="empty">还没有 run。</div>`;

  for (const item of runList.querySelectorAll(".run-item")) {
    item.addEventListener("click", async () => {
      state.selectedRun = await api(`/api/runs/${item.dataset.runId}`);
      state.events = await api(`/api/runs/${item.dataset.runId}/events`);
      renderDag();
      renderEvents();
    });
  }

  renderDag();
}

function renderDag() {
  const dag = document.querySelector("#dag");
  if (!state.selectedRun) {
    dag.innerHTML = `<div class="empty">选择一个 run 查看 DAG。</div>`;
    return;
  }
  dag.innerHTML = state.selectedRun.steps
    .map(
      (step) => `<button class="step-node" data-step-id="${step.stepId}">
        <strong>${step.stepId}</strong>
        <p>${step.employee} · ${step.skill}</p>
        ${statusPill(step.status)}
      </button>`,
    )
    .join("");
  for (const node of dag.querySelectorAll(".step-node")) {
    node.addEventListener("click", () => {
      state.selectedStep = state.selectedRun.steps.find((step) => step.stepId === node.dataset.stepId);
      renderStepDetail();
    });
  }
}

function renderApprovals() {
  const approvals = state.runs.flatMap((run) =>
    run.steps
      .filter((step) => step.status === "waiting_approval")
      .flatMap((step) =>
        step.permissionRequests
          .filter((request) => request.status === "pending")
          .map((request) => ({ run, step, request })),
      ),
  );
  document.querySelector("#approval-list").innerHTML =
    approvals
      .map(
        ({ run, step, request }) => `<div class="approval-item">
          <strong>${request.capability}</strong>
          <p>${request.reason}</p>
          <p>${run.workflowId} · ${step.stepId}</p>
          <button class="primary" data-run-id="${run.id}" data-step-id="${step.stepId}" data-capability="${request.capability}">批准</button>
        </div>`,
      )
      .join("") || `<div class="empty">没有待审批项。</div>`;
  for (const button of document.querySelectorAll("#approval-list button")) {
    button.addEventListener("click", async () => {
      await api(`/api/runs/${button.dataset.runId}/steps/${button.dataset.stepId}/approve`, {
        method: "POST",
        body: JSON.stringify({ capability: button.dataset.capability }),
      });
      await refresh();
    });
  }
}

function renderRegistry() {
  const groups = [
    ["Employees", state.registry.employees],
    ["Skills", state.registry.skills],
    ["Teams", state.registry.teams],
    ["Workflows", state.registry.workflows],
  ];
  document.querySelector("#registry-browser").innerHTML = groups
    .map(
      ([label, items]) => `<div class="registry-item">
        <strong>${label}</strong>
        <p>${items.length} items</p>
        <pre>${items.slice(0, 8).map((item) => item.id).join("\n")}</pre>
      </div>`,
    )
    .join("");
}

function renderStepDetail() {
  const detail = document.querySelector("#step-detail");
  if (!state.selectedStep) {
    detail.textContent = "选择一个 step 查看 prompt、artifact 和事件。";
    return;
  }
  detail.innerHTML = `<pre>${JSON.stringify(
    {
      stepId: state.selectedStep.stepId,
      employee: state.selectedStep.employee,
      skill: state.selectedStep.skill,
      status: state.selectedStep.status,
      dependencies: state.selectedStep.dependencies,
      permissionRequests: state.selectedStep.permissionRequests,
      artifacts: state.selectedStep.artifactIds,
      prompt: state.selectedStep.prompt,
    },
    null,
    2,
  )}</pre>
  <div class="output-form">
    <label>
      Manual output
      <textarea id="step-output-text" rows="6" placeholder="粘贴这个 step 的 Markdown 输出"></textarea>
    </label>
    <button class="primary" id="submit-step-output" type="button">提交输出</button>
  </div>`;
}

function renderEvents() {
  document.querySelector("#event-log").innerHTML =
    state.events.map((event) => `<pre>${JSON.stringify(event, null, 2)}</pre>`).join("") ||
    `<div class="empty">没有事件。</div>`;
}

function switchView(view) {
  for (const button of document.querySelectorAll(".nav-button")) {
    button.classList.toggle("active", button.dataset.view === view);
  }
  for (const panel of document.querySelectorAll(".view")) {
    panel.classList.toggle("active", panel.id === `${view}-view`);
  }
}

async function refresh() {
  state.registry = await api("/api/registry");
  state.runs = await api("/api/runs");
  if (state.selectedRun) {
    state.selectedRun = await api(`/api/runs/${state.selectedRun.id}`);
    state.events = await api(`/api/runs/${state.selectedRun.id}/events`);
  }
  renderSummary();
  renderLauncher();
  renderRuns();
  renderApprovals();
  renderRegistry();
  renderStepDetail();
  renderEvents();
}

for (const button of document.querySelectorAll(".nav-button")) {
  button.addEventListener("click", () => switchView(button.dataset.view));
}

document.querySelector("#refresh-button").addEventListener("click", refresh);
document.querySelector("#run-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const workflowId = document.querySelector("#workflow-select").value;
  const inputs = JSON.parse(document.querySelector("#inputs-text").value || "{}");
  state.selectedRun = await api("/api/runs", {
    method: "POST",
    body: JSON.stringify({ workflowId, inputs }),
  });
  state.events = await api(`/api/runs/${state.selectedRun.id}/events`);
  await refresh();
  switchView("runs");
});

document.addEventListener("click", async (event) => {
  if (event.target?.id !== "submit-step-output") {
    return;
  }
  if (!state.selectedRun || !state.selectedStep) {
    return;
  }
  const content = document.querySelector("#step-output-text").value;
  state.selectedRun = await api(
    `/api/runs/${state.selectedRun.id}/steps/${state.selectedStep.stepId}/output`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  state.selectedStep = state.selectedRun.steps.find((step) => step.stepId === state.selectedStep.stepId);
  state.events = await api(`/api/runs/${state.selectedRun.id}/events`);
  await refresh();
});

refresh().catch((error) => {
  document.querySelector("#summary").innerHTML = `<div class="metric"><strong>Error</strong><span>${error.message}</span></div>`;
});
