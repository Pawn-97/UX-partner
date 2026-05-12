---
description: 一键升级 ux-project 插件到最新版（拉 GitHub 上的 design-partner marketplace + 重装本插件）。不影响 KB 索引和项目数据。
argument-hint: (no args)
allowed-tools: Bash, Read
---

You are running `/ux-project:update`. This command refreshes the `design-partner` marketplace from GitHub and reinstalls the latest `ux-project` plugin. **It does NOT touch the user's KB index (context-mode FTS5) or any `projects/<name>/` data.**

## What this command does

1. Read current installed version from `~/.claude/plugins/installed_plugins.json`
2. Run `claude plugin marketplace update design-partner` (pulls latest from `Pawn-97/UX-partner`)
3. Run `claude plugin update ux-project -s user` (replaces cached version)
4. Read new installed version, report the bump
5. Remind designer to restart Claude Code for the new version to take effect

## Safety guarantees (state in plain language to designer)

- KB 索引在 context-mode（用户级 FTS5），跟插件版本无关，不会重做
- 所有 `projects/<name>/` 项目目录（state.md / memory/ / pm-source.md 等）都不会被动
- `ux-kb-curated/` 也不会被动
- 升级只换插件代码（skill / commands / templates）

## Execution

### Step 1 — Snapshot current version

Run:
```bash
cat ~/.claude/plugins/installed_plugins.json | grep -A 5 'ux-project@design-partner' | grep version
```

Save the version string as `before_version`.

### Step 2 — Refresh marketplace

Run:
```bash
claude plugin marketplace update design-partner
```

If exit code != 0, surface the error and STOP. Don't proceed to install.

### Step 3 — Update the plugin

Always use the fully-qualified name `ux-project@design-partner`. The unqualified form `ux-project` fails with "Plugin not found" even when only one plugin of that name is installed.

Run:
```bash
claude plugin update ux-project@design-partner -s user
```

If this fails (e.g., marketplace re-clone broke the registry link, or "already at latest" with no actual change), fall back to a hard reinstall:
```bash
claude plugin uninstall ux-project@design-partner -s user
claude plugin install ux-project@design-partner -s user
```

`uninstall` only removes the cached plugin code at `~/.claude/plugins/cache/design-partner/ux-project/<version>/`. It does NOT touch KB / projects / settings.

### Step 4 — Snapshot new version

Run again:
```bash
cat ~/.claude/plugins/installed_plugins.json | grep -A 5 'ux-project@design-partner' | grep version
```

Save as `after_version`.

### Step 5 — Report

Output to designer in plain Chinese (rule 22 — no jargon):

If `before_version != after_version`:
```
✅ 升级完成。
   旧版本：<before_version>
   新版本：<after_version>

   KB 索引 / 项目数据 / 设置都没动。

   重启一下 Claude Code 让新版本生效，然后继续 `/ux-project:refine` 即可。
```

If `before_version == after_version`:
```
ℹ️ 当前已是最新（<version>）。无变化。
```

If marketplace update failed:
```
❌ 升级失败：marketplace 拉不下来。
   常见原因：网络问题 / GitHub 不可达 / 仓库权限。
   错误信息：<bash stderr>
```

## What NOT to do

- 不要清 KB 缓存（`ctx_purge` 之类的命令绝对不能调）
- 不要碰 `projects/` 目录
- 不要碰 `.claude/settings.json`（除非升级本身需要——目前不需要）
- 不要在升级过程中静默修改任何项目文件
- 不要在对话里念字段名（`gitCommitSha` / `installPath` 等）——只报版本号
