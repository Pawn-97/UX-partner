# UX Partner

UX Partner 把 PM 的原始 PRD 转成有来源依据的 UX discovery 文件：

- `ux-onepage.md`：给评审和后续追溯用的单页源文件
- `ux-onepage.html`：给 stakeholder 看的网页一图流
- `design-brief.md`：交给下游 UI、Figma 或前端实现的简报

这个仓库同时支持 Claude Code 和 Codex。`.claude-plugin/` 是原有 Claude Code 插件源；`.codex-plugin/`、`skills/`、`commands/` 是 Codex 兼容入口，不复制业务规则。

[English](README.md) · **中文**

## 范围

做：问题梳理、JTBD、用户场景、信息架构、交互流程、容器级概念线框。

不做：高保真 UI、组件级线框、Figma 文件、视觉样式、前端代码。这些交给下游设计或实现工具。

## Claude Code 安装

在 Claude Code REPL 里：

```text
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

然后重启 Claude Code 或 reload plugins。

## Codex 安装

在 Codex 里：

```bash
codex plugin marketplace add Pawn-97/UX-partner
codex plugin add ux-project@design-partner
```

本地开发：

```bash
git clone git@github.com:Pawn-97/UX-partner.git Design-partner
cd Design-partner
codex plugin marketplace add "$(pwd)"
codex plugin add ux-project@design-partner
```

## 工作流

```text
/ux-project:setup-kb /path/to/kb
/ux-project:start <name> <prd-path>
/ux-project:refine
/ux-project:add-context <name> <text-or-path>
/ux-project:export-html
/ux-project:handoff
```

## 命令

| 命令 | 作用 |
|---|---|
| `/ux-project:setup-kb <kb-path>` | 给 markdown KB 分类并入库 |
| `/ux-project:start <name> <prd-path>` | 创建 `projects/<name>/`，复制 PRD，创建一图流初稿 |
| `/ux-project:resume <name>` | 从 `state.md` 恢复项目 |
| `/ux-project:refine` | 继续梳理并填充 `ux-onepage.md` |
| `/ux-project:add-context <name> <text-or-path>` | 补充背景、提议记忆写入、标记需要复查的部分 |
| `/ux-project:export-html` | 把 `ux-onepage.md` 渲染成 `ux-onepage.html` |
| `/ux-project:handoff` | 生成 `design-brief.md` |
| `/ux-project:update` | 刷新已安装插件 |

## 约定

始终在仓库根目录运行，不要 `cd projects/<name>/` 后再跑插件命令。模板和 curated KB 查找都从当前目录往下走。

项目记忆按需创建。不要提前创建 `decisions.md`、`assumptions.md`、`questions.md` 或 `memory/*`。

插件不会静默写记忆。它会先提议，再等你明确确认。

`ux-onepage.md` 里的实质性结论都需要来源。缺来源或来源已失效时不能收尾。

## 目录

```text
.
├── .claude-plugin/        # Claude Code 插件源
├── .codex-plugin/         # Codex manifest
├── commands/              # Codex slash command 入口
├── skills/                # Codex skill 入口
├── ux-kb-curated/         # 共享词表、设计原则、偏好
└── projects/<name>/       # 每个项目自己的运行文件
```

## License

MIT
