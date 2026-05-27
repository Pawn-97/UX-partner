---
description: Refresh ux-project from the configured Claude Code marketplace. Does not touch KB indexes or project data.
argument-hint: (no args)
allowed-tools: Bash, Read
---

You are running `/ux-project:update`. This command refreshes the `design-partner` marketplace from GitHub and reinstalls `ux-project`. It does not touch the user's KB index or any `projects/<name>/` data.

## Safety guarantees

- KB indexes stay untouched.
- `projects/<name>/` stays untouched.
- `ux-kb-curated/` stays untouched.
- Only plugin code changes: skill, commands, templates, scripts, and vendor references.

## Execution

### 1. Refresh marketplace

Run:
```bash
claude plugin marketplace update design-partner
```

If this fails, surface the error and stop.

### 2. Update plugin

Always use the fully qualified name:
```bash
claude plugin update ux-project@design-partner -s user
```

If this fails because the cache is stale or the registry link is broken, fall back to:
```bash
claude plugin uninstall ux-project@design-partner -s user
claude plugin install ux-project@design-partner -s user
```

Uninstall only removes cached plugin code. It does not touch KB, projects, or settings.

### 3. Report

Use plain Chinese:
```text
更新完成。KB 索引、项目数据、设置都没动。
重启 Claude Code 后继续 `/ux-project:refine` 即可。
```

If marketplace update failed:
```text
更新失败：marketplace 拉不下来。
常见原因：网络问题 / GitHub 不可达 / 仓库权限。
错误信息：<bash stderr>
```

## What NOT to do

- Do not clear KB cache.
- Do not touch `projects/`.
- Do not touch `.claude/settings.json`.
- Do not silently modify project files.
- Do not show install paths, cache IDs, commit hashes, or release identifiers in the user-facing report.
