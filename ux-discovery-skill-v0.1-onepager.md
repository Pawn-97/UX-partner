# UX Discovery Skill v0.1 — One-Pager

> 由 idea-refine 流程产出。原始构想见 `ux_discovery_partner_skill_创建文档.md`，本文档是收敛后的 v0.1 落地方案。

---

## 1. Problem Statement

**HMW 把"UX 设计师拿到 PM 的 PRD → 多轮 discovery 讨论 → 高质量 ux-onepage → 喂给下游 prototype skill"这条链路，做成一个聚焦、单一职责、复用现有 KB 基础设施的 Claude Code skill？**

---

## 2. Recommended Direction

**Direction A' — Onepage-first，瘦身集成**

skill 本体只做一件事：**驱动 discovery 讨论，输出 ux-onepage.md + design-brief.md**。
- 项目记忆 = 3–5 个 markdown 文件，懒创建（`state.md` 是 resume gateway）
- KB = 复用 `Phone-KnowledgeBase`（640 文件），通过 **context-mode FTS5** 检索，不自建索引
- 双输出：`ux-onepage.md`（给 PM/Eng review）+ `design-brief.md`（给下游 design skill）
- **Cite-or-die**：onepage 每条 claim 必须有 `[ref: path]`，否则阻塞 close

不做 UI、不做 wireframe、不做 KB 编译、不做复杂状态机、不做 event-journal。

---

## 3. Skill Architecture

```
~/.claude/skills/ux-discovery/                  # skill 定义
  SKILL.md
  templates/
    state.md.template
    questions.md.template
    decisions.md.template
    assumptions.md.template
    ux-onepage.md.template
    design-brief.md.template

~/Claude Code-works/AI-projects/Design-partner/  # skill 主仓 + 项目工作区
  projects/<project-name>/                       # 每个需求一个目录
  ux-kb-curated/
    glossary.md
    design-principles.md

~/Phone-KnowledgeBase/                           # 已有 KB（已 index 进 context-mode）
  .tools/
    index-to-context-mode.js                     # 新增：批量索引脚本
    compile-kb.js                                # 已存在，不动
```

**跨目录关系**：skill 通过 `ctx_search` 调 KB，物理上完全分离。KB 保持纯产品知识，skill 项目工作区保持纯 discovery 状态。

---

## 4. Project Directory Structure（懒创建）

```
projects/<project-name>/
  pm-source.md          # PRD 原件，read-only       [/start 时创建]
  state.md              # 当前理解 + phase           [/start 时创建]
  decisions.md          # 决策日志                   [首次决策时创建]
  questions.md          # open / answered            [首次问题时创建]
  assumptions.md        # active / validated / rejected  [首次假设时创建]
  ux-onepage.md         # 最终交付                   [/onepage 时创建]
  design-brief.md       # 下游 handoff              [/handoff 时创建]
```

最小项目可能只有 2 文件（`pm-source.md` + `state.md`）。最大项目 7 文件。

---

## 5. SKILL.md 草案

````markdown
# UX Discovery Partner

## Description
Triggers when a UX designer brings a PRD and needs to produce a UX onepage before any UI work. NOT a UI/wireframe generator. Triggers: "ux discovery", "需求拆解", "需求理解", "JTBD 梳理", "PRD 分析", "ux-onepage", "design brief"。

## Purpose
Help UX designers turn raw PM PRDs into sharp, KB-grounded ux-onepage.md and design-brief.md. Drives multi-round discovery, surfaces solution bias, separates facts / assumptions / decisions, produces deliverables that downstream prototype skills consume directly.

## Non-goals
Do not generate wireframes, hi-fi UI, Figma layouts, HTML prototypes, or visual design. Those are handled by huashu-design / frontend-design / Figma skills downstream.

## Operating Principles
1. PRD is the entry. Always start by reading the PRD file the designer points to.
2. Don't jump to solutions. Reframe the user problem before discussing UI.
3. **Cite or die.** Every claim in the onepage must have `[ref: path]` to a source (PRD, KB, decisions.md).
4. Designer is the final judge. LLM recommends closure; designer confirms.
5. Lazy file creation. Project memory grows on demand.
6. Use `ctx_search` before reading. KB is 640 files; never bulk-load.
7. Each discussion round = 3–5 focused questions, with WHY each matters.
8. **Outdated source detection.** Before accepting any cite to `pm-source.md`, check its frontmatter `valid_to`. If set and earlier than today, warn the designer with `⚠️ outdated` and surface `superseded_by` if present.

## Commands

### `/ux-project:start <project-name> <prd-file-path>`
Initialize a project workspace.
- Create `projects/<project-name>/`
- Copy PRD → `pm-source.md` (read-only)
- Create `state.md` with initial phase = `intake`
- Run `ctx_search` on top keywords from PRD
- Output initial requirement analysis: PM original ask, possible solution bias, key ambiguities, suggested first 3-5 questions

### `/ux-project:resume <project-name>`
Restore project context across sessions.
- Read **only** `state.md` (gateway file)
- Print: current phase, last update, recommended next step
- Other files read on demand during discussion

### `/ux-project:onepage`
Generate `ux-onepage.md` (requires explicit designer approval).
- Run **cite-check**: every claim must have `[ref: ...]`; missing refs block generation
- Run **outdated-check**: any cited PRD with `valid_to < today` triggers a warning; designer must confirm or update the ref to the `superseded_by` version
- Synthesize from `state.md` + `decisions.md` + `assumptions.md` + `questions.md`
- Update `state.md` phase = `onepage-generated`

### `/ux-project:handoff`
Generate `design-brief.md` for downstream design skill.
- Synthesize from `ux-onepage.md`
- Output 8–15 lines optimized for huashu-design / frontend-design input
- Update `state.md` phase = `handoff-ready`

## KB Usage Rule
- General reframe / discussion → no ctx_search, rely on LLM + `ux-kb-curated/glossary.md` + `design-principles.md`
- Specific factual claims → ctx_search required
- Onepage drafting → ctx_search required for every cited section
- Result top 5 chunks, never bulk-load full files

## Memory Write Rule
Before writing to `decisions.md` / `assumptions.md` / `questions.md`, always show the proposed entry to the designer and ask "记入吗？" Do not silently write. Each entry must include: type, content, source, confidence, owner, date.

## Closure Rule
Skill can recommend closure. Designer must explicitly say "close" or equivalent. v0.1 does NOT implement complex state machine — just check designer's last message before generating onepage.
````

---

## 6. 关键模板

### pm-source.md（PRD 原件，read-only + 时间有效性元数据）
```yaml
---
project: <name>
prd_version: v1                  # 每次 PRD 更新递增
valid_from: 2026-04-15           # PRD 生效日期
valid_to: null                   # 开区间；被新版替换时填日期
superseded_by: null              # 路径，例如 "./pm-source-v2.md"
---
```
下方为 PRD 原文。任何 onepage 引用此文件时，cite-check 会做 outdated-check。

**版本流转规则**：PM 给新版 PRD 时，新建 `pm-source-v2.md`，把旧版 `valid_to` 填今天日期、`superseded_by` 指向新版。旧版不删（refs 可能仍在 history 里）。

### state.md（resume gateway）
```markdown
---
project: <name>
prd_source: ./pm-source.md
created: <date>
last_updated: <date>
phase: intake | analysis | discussion | closure-check | onepage-generated | handoff-ready
---

# Current Understanding
（一段话，<150 字，对需求的核心理解）

# Confirmed Decisions (top 3-5)
- D1: ... → see decisions.md
- D2: ...

# Active Assumptions (top 3)
- A1: ... → see assumptions.md

# Open Questions (blocking only)
- Q1: ... → see questions.md

# Recommended Next Step
（一句话）
```

### ux-onepage.md（强制 cite）
```markdown
---
project: <name>
generated: <date>
prd_source: ./pm-source.md
---

# 1. Final Goal
<一句话> [ref: pm-source.md:L12-15]

# 2. Problem Framing
<...> [ref: ...]

# 3. PM Original Ask vs. Interpreted User Need
| Original | Interpreted | Source |
|---|---|---|

# 4. Target Users
- Primary: <role> [ref: ...]
- Secondary: ...
- Impacted: ...

# 5. User Behaviors
- Current / Desired / Failure / Edge — each with [ref]

# 6. JTBD
- Primary / Secondary / Anti-JTBD

# 7. Key Scenarios (3-5)

# 8. Constraints from KB
| Constraint | Source | Confidence |

# 9. Key Decisions
（from decisions.md）

# 10. Active Assumptions
（from assumptions.md, 仅 active）

# 11. Open Questions
- Blocking
- Deferred

# 12. Design Direction Hypothesis
（无 UI 细节，只方向）

# 13. Handoff Notes
（给下游 design skill 的注意事项）
```

**Cite-check 规则**：任何 claim 没有 `[ref: ...]` → `/ux-project:onepage` 失败，列出缺失项让设计师补全。

### design-brief.md（短）
```markdown
# Design Brief: <project>

## In one sentence
<who> needs to <do what> in <which context>, so that <why>.

## Primary user
<role> + <key motivation>

## Primary JTBD
When... I want to... so I can...

## Must-cover scenarios (3-5)

## Hard constraints
- ... [ref]

## States to consider
default / empty / loading / success / error / permission-restricted / edge

## Don't design yet
- <thing> (reason)

## Suggested first design exploration prompt
"<prompt for huashu-design / frontend-design>"
```

---

## 7. KB 改造方案

### 当前状态盘点（已有的不重做）

| 原计划 | 你已有的 | 动作 |
|---|---|---|
| raw 层 | `20-Zoom-Phone-Features/` (640 files) | 不动 |
| wiki 层 | `10-LLM-Wiki/` (auto-generated) | 不动 |
| 编译脚本 | `.tools/compile-kb.js` | 不动 |
| frontmatter | `type / source_commit / imported_on` | 扩展加 `source_quality` |
| context-mode 索引 | ❌ | **新增** |
| 策展层 | ❌ | **新增** |

### 改造步骤

**Phase 0（半天）**：决策对齐
- `source_quality` 枚举值：`PRODUCT-DOC` / `TEMPLATE` / `PLAYBOOK` / `META` / `OUTDATED`
- `confidence` 枚举值：`high` / `medium` / `low`
- PRD 输入格式：约定为 markdown（飞书/Confluence 导出前先转 md）

**Phase 1（1 天）**：一次性 ingest，伪代码：
```js
// .tools/index-to-context-mode.js
const QUALITY_RULES = {
  '20-Zoom-Phone-Features/**': 'PRODUCT-DOC',
  '40-Templates/**': 'TEMPLATE',
  '30-Agent-Playbooks/**': 'PLAYBOOK',
  '90-Maintenance/**': 'META',
};

function inferQuality(filePath) {
  for (const [pattern, quality] of Object.entries(QUALITY_RULES)) {
    if (matchGlob(filePath, pattern)) return quality;
  }
  return 'UNCATEGORIZED';
}

walkAllMarkdown(KB_ROOT).forEach(file => {
  const quality = inferQuality(file);
  const content = fs.readFileSync(file, 'utf8');
  const tagged = `[${quality}] ${content}`;
  ctxIndex({ id: file, content: tagged });  // 调用 context-mode index API
});
```
跑一次，640 文件入 context-mode。

**Phase 2（1–2 天，半自动）**：策展层
- `draft-glossary.js`：LLM 扫 `10-LLM-Wiki/Master Index.md` + `Feature Cross References.md`，抽术语 + 候选同义词，产出 `glossary-draft.md`
- 你手工 review 精简到 < 100 行 → 保存到 `~/Claude Code-works/AI-projects/Design-partner/ux-kb-curated/glossary.md`
- 同样方式从 `40-Templates/` 抽 design principles 候选，review 后保存

**Phase 3（持续）**：维护
- 现有 `compile-kb.js` 加最后一步：调用 `index-to-context-mode.js` 重新索引
- 新增 PRD 进 raw → 已有自动化处理
- glossary / design-principles 手工维护，季度 review

---

## 8. MVP 边界

### v0.1 必须有
- [x] SKILL.md
- [x] 5 个 slash commands（`setup-kb` / `start` / `resume` / `onepage` / `handoff`）
- [x] 7 份模板（pm-source / state / decisions / assumptions / questions / onepage / brief）
- [x] cite-or-die 强制逻辑
- [x] **PRD 时间有效性 frontmatter**（`prd_version` / `valid_from` / `valid_to` / `superseded_by`）
- [x] **outdated-check**：cite PRD 时检查 `valid_to`，过期则警告
- [x] context-mode 一次性索引（`index-to-context-mode.js`）
- [x] `glossary.md` + `design-principles.md`（人工策展，<200 行合计）

### v0.1 不做（explicit Not Doing）
- ❌ KB 自动 lint —— v0.2 再说
- ❌ 跨项目搜索 —— 单项目优先
- ❌ event-journal.jsonl —— git log 替代
- ❌ resume-pack.md —— state.md 已够
- ❌ 自动 phase 检测 —— 设计师在哪 phase 就在哪
- ❌ Round 1-6 严格协议 —— 改为讨论原则（每轮 3-5 问），不强制轮次
- ❌ KB compile / wiki regenerate —— 你已有 `compile-kb.js`
- ❌ Closure 双门状态机 —— 简化为"用户说 close 就 close"
- ❌ 任何 UI / wireframe / Figma 生成 —— 这是下游 skill 的事
- ❌ 多用户并发 / 团队权限 —— 单人优先，团队版进 v0.2+
- ❌ 自动 source quality 判定 —— 路径规则 + 人工抽查
- ❌ 时间衰减 / 过期标记自动化 —— 季度 lint 时人工

---

## 9. 待验证假设（5 条 + 验证方式）

| # | 假设 | 验证方式 | 失败信号 |
|---|---|---|---|
| 1 | Onepage 13 章模板可裁剪适配大小不同的需求 | 跑 1 简单 + 1 复杂需求，比对填充情况 | >40% section 永远空 |
| 2 | Onepage 喂给 huashu-design 能直接消化 | 拿 v0.1 onepage 跑一次 huashu-design，看输入吸收率 | huashu 反复要求补信息 |
| 3 | context-mode + 标签前缀 + glossary 三层够用 | 构造 5 个跨术语 case（"alt routing" vs "备用路径" 等） | 召回率 < 60% |
| 4 | state.md 一个文件够 resume | 隔一周重开同项目，看是否能续上 | 必须读 3+ 文件才能续 |
| 5 | cite-or-die 不会让流程崩 | 跑 2 个真实项目，记录设计师反馈 | 设计师抱怨"找 ref 太累" |

每条假设的验证可以在 v0.1 跑通后第 1-2 周完成。

---

## 10. Open Questions（v0.1 不解决，但要记下来）

1. **PRD 格式约束**：markdown / docx / 飞书导出？目前假设设计师手工转 md，Phase 0 确认。
2. **多设计师共享 KB 的并发写**：v0.1 单人优先，团队版进 v0.2+。
3. **design-brief 喂给 huashu-design 的具体接口字段**：需要去看 huashu-design SKILL.md 对齐，可能需要小调整。
4. **跨项目复用决策**：项目 A 的某条决策能否被项目 B reference？v0.1 不解决，但目录结构预留了路径。
5. **PRD 引用粒度**：onepage cite 时是行号、章节还是段落？v0.1 用行号（`pm-source.md:L12-15`），跑一段时间后看是否需要换章节锚点。

---

## 11. Phase 路线图

```
Phase 0：决策对齐                            (半天，你 + 我)
  - source_quality / confidence 取值规则
  - PRD 格式约束
  - design-brief 字段对齐 huashu-design

Phase 1：KB 一次性索引 + 标签                (1 天，可自动化)
  - 写 .tools/index-to-context-mode.js
  - 跑一次，640 文件入 context-mode
  - frontmatter 扩展 source_quality

Phase 2：极简策展                            (1-2 天，半自动)
  - draft-glossary.js → review → glossary.md
  - LLM 抽 design-principles 候选 → review

Phase 3：skill v0.1 实现                     (1-2 周)
  - SKILL.md
  - 4 个 commands 的具体逻辑
  - 6 份模板
  - cite-check 实现
  - 简单 dogfood 测试

Phase 4：dogfood + 验证假设                  (持续 1-2 周)
  - 跑 2-3 个真实需求
  - 验证 5 个假设
  - 收集反馈 → v0.2 backlog
```

**总时长估计**：v0.1 落地 = 2-3 周（Phase 0–3） + dogfood 1-2 周 = **4-5 周到稳定可用**。

---

## 12. 与原构想文档的对比（什么被砍了）

| 原文档要求 | v0.1 处理 | 理由 |
|---|---|---|
| `/uxkb:init/scan/ingest/compile/lint/query` 6 命令 | 砍到 0，全交给 context-mode + `compile-kb.js` | 重复造轮子 |
| `/ux-project:start/analyze/discuss/checkpoint/resume/closure-check/close/handoff-design` 8 命令 | 砍到 4（start/resume/onepage/handoff） | 大部分是状态机的伪命令 |
| `event-journal.jsonl` + `latest-state.md` + `resume-pack.md` + `checkpoints/` | 只留 `state.md` | git 已是事件日志 |
| Round 1-6 严格协议 | 改为操作原则 | 强制轮次违反真实讨论节奏 |
| Closure 双门状态机 | 改为简单 confirm | v0.1 不需要状态机 |
| KB raw / wiki / schemas / logs 全套 | 复用你已有的 | 你已经有了 |
| Project wiki 11 文件 | 砍到 4 + 输出 2 = 6 文件 | 大部分字段会永远空 |

**被保留的精华**（原文档最有价值的部分）：
- 双门收尾原则
- 事实/假设/推理/决策 4 类知识分层
- onepage 13 章模板（结构非常合理）
- "PM original ask vs interpreted user need" 对照
- 反 solution-bias 的讨论原则
- 多轮、聚焦提问、不一次性问 20 个

---

## 13. 下一步

1. **决策对齐**（半天）：确认 source_quality 枚举、PRD 格式、design-brief 字段
2. **写脚本**（1 天）：`index-to-context-mode.js`
3. **写 SKILL.md + 模板**（2-3 天）
4. **跑通第一个真实需求**（1 周）
5. **review + v0.2 规划**

如果同意，我可以马上开始 Phase 0：起草 source_quality 枚举规则 + PRD 格式约束 + 看一下 huashu-design 的 SKILL.md 来对齐 design-brief 字段。
