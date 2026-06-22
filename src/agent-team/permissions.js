const CAPABILITY_PATTERNS = [
  {
    capability: "write_files",
    pattern: /(write files|修改文件|写文件|写入|保存到|apply_patch|生成文件|创建文件|edit files)/i,
    reason: "step may write or modify local files",
  },
  {
    capability: "run_commands",
    pattern: /(run commands|terminal|shell|tests|命令|终端|执行|构建|测试)/i,
    reason: "step may execute local commands",
  },
  {
    capability: "network",
    pattern: /(network|http|api|fetch|web|联网|网络|下载|上传)/i,
    reason: "step may access network resources",
  },
  {
    capability: "git_write",
    pattern: /(git push|git commit|git merge|git rebase|git checkout|git_write|提交|推送|合并分支)/i,
    reason: "step may modify git state",
  },
  {
    capability: "secrets",
    pattern: /(secret|token|api key|password|cookie|session|密钥|密码|凭据)/i,
    reason: "step may handle sensitive credentials",
  },
  {
    capability: "external_publish",
    pattern: /(publish|deploy|release|post to|上线|发布|部署|发帖)/i,
    reason: "step may publish outside the local workspace",
  },
];

export const SAFE_CAPABILITIES = new Set(["read_files"]);

function disablesNetwork(inputs) {
  const text = Object.values(inputs ?? {})
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value))
    .join("\n");

  return /(no network|no internet|offline|local only|without network|do not browse|不联网|不要联网|无需联网|离线|仅本地|本地事实|不使用网络)/i.test(
    text,
  );
}

export function inferPermissionRequests(employee, step, inputs = {}) {
  const text = `${employee?.tools?.join("\n") ?? ""}\n${step.task ?? ""}`;
  const requests = [];
  const networkDisabled = disablesNetwork(inputs);

  for (const item of CAPABILITY_PATTERNS) {
    if (item.capability === "network" && networkDisabled) {
      continue;
    }
    if (item.pattern.test(text)) {
      requests.push({
        capability: item.capability,
        reason: item.reason,
        status: "pending",
        approvedAt: null,
      });
    }
  }

  return requests;
}

export function needsApproval(permissionRequests) {
  return permissionRequests.some((request) => request.status !== "approved");
}
