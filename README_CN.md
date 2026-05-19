# UX Partner

一个 Claude Code 插件，把 PM 的原始 PRD 通过 **三阶段强 gate 工作流**，转成 KB-grounded 的 UX discovery 产物 —— `ux-onepage.md`、`ux-onepage.html`（一图流）、`design-brief.md`。

给 UX 设计师用，产出直接喂下游设计工具（huashu-design、frontend-design、Figma）。

[English](README.md) · **中文**

## 你拿到什么

- **`ux-onepage.md`** —— 工程可读的 discovery 单页，强制 cite-or-die
- **`ux-onepage.html`** —— 给 stakeholder 看的一图流，瑞士国际主义 IKB 克莱因蓝视觉系统，自包含、打印友好
- **`design-brief.md`** —— 给下游设计工具的干净交接稿
- **项目记忆** —— `decisions / assumptions / questions / memory/*`，跨 session 保留

## 范围边界

**In-scope**（upstream 设计资产）：
问题 reframe · JTBD · 场景发散/收敛 · IA 结构 · 交互流程（黑白）· 容器级 wireframe

**Out-of-scope**（下游工具的事）：
Hi-fi UI · 组件级 wireframe · Figma 制品 · 色彩/字体 · 前端代码

## 安装

### 走 marketplace（推荐）

在 Claude Code REPL 里跑：

```
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

重启 Claude Code。`ux-discovery` skill 在你说出"需求拆解 / JTBD 梳理 / PRD 分析 / ux discovery"等关键词时自动激活。

### 本地 clone（开发用）

```bash
git clone git@github.com:Pawn-97/UX-partner.git Design-partner
cd Design-partner
claude
```

进 REPL 后：

```
/plugin marketplace add "$(pwd)"
/plugin install ux-project@design-partner
```

### KB 一次性索引

```
/ux-project:setup-kb /path/to/your/KB
```

按 `source_quality` 给 KB 里每个 markdown 分类，索引进 context-mode。幂等。如果你的 KB 不是 Johnny-Decimal 数字前缀结构，改 [`.claude-plugin/scripts/index-to-context-mode.js`](.claude-plugin/scripts/index-to-context-mode.js) 里的 `QUALITY_RULES`。

## 工作流

```
/ux-project:start <name> <prd-path>   →  建 projects/<name>/ + 初次 KB 分析
/ux-project:refine                    →  跑三阶段强 gate
/ux-project:onepage                   →  生成 ux-onepage.md + .html
/ux-project:handoff                   →  生成 design-brief.md
```

### 三个阶段

| 阶段 | 做什么 | 产物 |
|---|---|---|
| **Understand & Expand** | 读 PRD · KB-first 背景扫描 · 5 lens 场景发散 · 线上行为基线 | 场景地图 · baseline memory |
| **Evaluate & Converge** | JTBD rubric（用户价值 × 实现成本 × 战略契合）· KEEP / CUT 决策 · Not Doing 列表 | 最终场景 · JTBD list |
| **Sharpen & Ship** | IA 结构（概念层）· 交互流程（Mermaid 黑白）· cite-check · 设计师 approve | `ux-onepage.md` + `ux-onepage.html` |

每个阶段结尾一个显式 `AskUserQuestion` gate（Approve / Revise / Drill-down / Hold）。技能**从不**自动前进。

## Slash 命令

| 命令 | 作用 |
|---|---|
| `/ux-project:setup-kb <kb-path>` | 一次性 KB 分类 + 索引（幂等） |
| `/ux-project:start <name> <prd-path>` | 从 PRD 开新项目（`.md` 或 `.docx`） |
| `/ux-project:resume <name>` | 按项目名切换当前项目（读 `state.md`） |
| `/ux-project:refine` | 跑三阶段强 gate 工作流 |
| `/ux-project:add-context <name> <text-or-path>` | 补背景、propose memory 写入、把 onepage 标 stale |
| `/ux-project:onepage` | 生成 `ux-onepage.md` + `.html`（cite-check + memory-status + outdated gates） |
| `/ux-project:handoff` | 生成 `design-brief.md` |
| `/ux-project:update` | 从 marketplace 升级插件 |

## 约定

**永远在 workspace 根目录跑命令** —— `.claude-plugin/` 所在的那一层。**别 `cd projects/<name>/` 再跑**，`Glob` 从 cwd 往下走，进了项目子目录就找不到 `.claude-plugin/templates/` 和 `ux-kb-curated/`。切项目用 `/ux-project:resume <name>`，**不要**靠改目录。

**懒创建** —— 项目记忆按需生长。`decisions.md / assumptions.md / questions.md / memory/*` 只在第一次需要时才落地，**别提前手动建**。

**Cite-or-die** —— `ux-onepage.md` 每条 claim 必须有 `[ref: path]`。优先级：PRD > KB > project memory > assumptions。缺 cite 或 cite 指向 `status != active` 的 memory 条目 → 阻塞生成。

**Memory 写入闸门** —— skill 从不静默写 memory file。每条都通过 `AskUserQuestion` 提议给你，你确认了才追加。

完整 operating principles 见 [`.claude-plugin/skills/ux-discovery/SKILL.md`](.claude-plugin/skills/ux-discovery/SKILL.md)。

## 目录结构

```
.
├── .claude-plugin/        # 插件代码（skill + commands + templates + KB 索引器）
├── ux-kb-curated/         # 所有项目共享（glossary、design-principles）
└── projects/<name>/       # 每个需求一个目录，懒创建
    ├── pm-source.md
    ├── state.md           # resume gateway
    ├── ux-onepage.md / .html
    └── memory/, decisions.md, ...
```

跨项目自动共享：context-mode KB 索引（user-global）+ `ux-kb-curated/*`。
项目独立：`projects/<name>/` 下所有文件。

## License

MIT —— 见 [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json)。
