# UX Discovery Skill v0.2 — One-Pager

> 由 idea-refine 流程产出（基于 2026-05-08 三轮讨论收敛）。本文档是 v0.1 的**增量升级方案**，专注 delta；未变更内容请参考 [v0.1 onepager](ux-discovery-skill-v0.1-onepager.md)。

---

## 1. v0.2 升级目标

v0.1 跑通后暴露三个真实工作流缺口：

| 缺口 | 真实场景 | v0.2 对应 |
|---|---|---|
| 设计师收到 PRD 后第一反应是"对不对" | LLM 当场抛 5 个问题，设计师不知道 LLM 理解对了没 | **Ask 1：首响应结构化总结** |
| Discovery 中持续从上下游同事吸收新背景 | "刚和 PM 聊完……"、"Eng 说 API 不支持……" | **Ask 2：`/add-context` + onepage stale 标记** |
| 项目跨 session、跨周持续推进，背景知识在脑里散落 | resume 后只能从 state.md 回忆，但同事 feedback / 项目术语 / 硬约束没地方收 | **Ask 3：项目级 context-memory 双层结构** |

**v0.2 不重做** v0.1 的 KB 索引、cite-or-die、outdated-check、4 commands、6 templates；这些保留并扩展。

---

## 2. v0.2 三件套 — 高层方案

### Ask 1：首响应结构化总结

`/ux-project:start` 完成 PRD 拷贝 + ctx_search 后，**强制输出 <200 字结构化任务总结** + "我理解对吗？" + 3-5 个聚焦问题。设计师 confirm/edit/reject 后再写 `state.md#Current Understanding`。

### Ask 2：持续背景补充

新增命令 `/ux-project:add-context <text|path>`：LLM 分类提议 → 设计师 confirm → 写入对应 memory 文件 / decisions / assumptions。如果 onepage 已生成，自动给 `ux-onepage.md` frontmatter 打 `stale: true` + reason；设计师手动跑 `/ux-project:onepage` 时触发 regen + diff。

### Ask 3：项目级记忆能力

新增 **context-memory** 文件层（与 v0.1 已有的 discussion-memory 互补）：

| 类别 | 性质 | 文件 | 来源 |
|---|---|---|---|
| discussion-memory | 讨论产物 | `decisions.md` / `assumptions.md` / `questions.md` | v0.1 已有，**保留** |
| context-memory | 项目背景知识 | `memory/stakeholders.md` / `constraints.md` / `terminology.md` / `history.md` / `preferences.md` | **v0.2 新增** |
| 跨项目记忆 | designer 偏好 / 术语 / 原则 | `ux-kb-curated/designer-preferences.md` (新增) + `glossary.md` / `design-principles.md` (v0.1) | **v0.2 扩展** |

写入两条路径：(1) `/add-context` 主动触发 (2) 对话中 LLM 被动提议（默认 batched，每 5 轮一次，可关闭）。

---

## 3. 文件结构（v0.2 增量，★ 为新增）

```
~/.claude/skills/ux-discovery/
  SKILL.md                            # 升级
  templates/
    state.md.template                 # 升级 — 加 Memory Index 段
    questions.md.template             # v0.1
    decisions.md.template             # v0.1
    assumptions.md.template           # v0.1
    ux-onepage.md.template            # 升级 — 加 stale frontmatter
    design-brief.md.template          # v0.1
    memory-stakeholders.md.template   # ★ 新增
    memory-constraints.md.template    # ★ 新增
    memory-terminology.md.template    # ★ 新增
    memory-history.md.template        # ★ 新增
    memory-preferences.md.template    # ★ 新增
    background.md.template            # ★ 新增

~/Claude Code-works/AI-projects/Design-partner/
  projects/<project-name>/
    pm-source.md                      # v0.1
    state.md                          # v0.1 + Memory Index 段
    decisions.md / assumptions.md / questions.md   # v0.1
    ux-onepage.md / design-brief.md   # v0.1 + stale frontmatter
    background.md                     # ★ 新增 — append-only 原始补充
    memory/                           # ★ 新增
      stakeholders.md
      constraints.md
      terminology.md
      history.md
      preferences.md
  ux-kb-curated/
    glossary.md                       # v0.1
    design-principles.md              # v0.1
    designer-preferences.md           # ★ 新增 — 跨项目偏好

~/Phone-KnowledgeBase/                # 不变
```

---

## 4. SKILL.md v0.2 增量

### 新增 Operating Principles（接 v0.1 的 1-8）

9. **首响应即理解**：`/start` 必产出结构化任务总结，强制 designer confirm 后写入 state.md。
10. **背景持续吸收**：discussion 中 LLM 主动 propose memory（默认 batched 每 5 轮），设计师 confirm。`/add-context` 是主动入口。
11. **memory cite 优先级**：onepage cite 顺序 PRD > KB > project memory > assumptions。
12. **stale ≠ invalid**：onepage 标 stale 不等于内容失效，只是有新背景未消化；设计师决定何时 regen。
13. **PRD 升版默认 lazy**：升版只弹"现在 review / 稍后"提示，不强扫。
14. **state.md size cap**：`state.md` 正文 ≤30 行 / <1k tokens 硬约束。溢出时 skill 把最旧的 Memory Index 条目 demote 到 `memory/<file>.md`（条目仍在 memory file，仅从 state.md 索引移除）。`Recommended Next Step` 永远保留不被 demote。
15. **读触发 propose**：LLM 在 discussion 中读 `memory/*.md` / `decisions.md` / `assumptions.md` 时，自动 inject "如发现需要 add/update/correct，立即提议"。事件驱动，与 batched auto-propose **并行**，不替代。

> 原则 14-15 借鉴自 [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) 的 L1 hard cap + read-side hint 模式（2026-05-08 调研）。

### 新增 / 升级 Commands

#### `/ux-project:start <project-name> <prd-file-path>` (升级)

v0.2 强制流程：
1. 创建 `projects/<project-name>/` + 拷 PRD → `pm-source.md`
2. 创建 `state.md` (phase=`intake`)
3. `ctx_search` 顶级关键词
4. **★ 输出结构化任务总结**（<200 字，固定结构）：
   ```
   ## 我对这个任务的初步理解
   - **核心问题**：……
   - **目标用户**：……
   - **PM 给的 ask**：……
   - **可能的 solution bias**：……
   - **关键模糊点**：……

   ## 我理解对吗？

   ## 接下来想问你的 3-5 个问题
   1. ……
   ```
5. 设计师 confirm / inline 修订 / reject
6. confirm 后写入 `state.md#Current Understanding`

#### `/ux-project:add-context <text|path>` ★ 新增

主动补充背景。
1. 接受 (a) 自由文本 (b) 文件路径（md/txt） (c) 多段（逗号分隔）
2. 原文 append 到 `background.md`（不丢原始）
3. LLM 分类提议（`stakeholder` / `constraint` / `terminology` / `history` / `preference` / 或归入 v0.1 的 `decision` / `assumption`）
4. 提议落盘文件 + 条目内容 → "记入 `memory/<file>.md` 吗？"
5. 设计师 confirm / edit / reject
6. confirm 后：
   - 写入对应 memory 文件
   - 更新 `state.md` (`last_updated` + Memory Index)
   - 如果 `ux-onepage.md` 已存在 → frontmatter 加 `stale: true` + `stale_reason: "added m-<id>"`

#### `/ux-project:onepage` (升级)

v0.1 cite-check + outdated-check + 现在加：
- **★ memory status check**：cite 到的 memory 必须 `status: active`；`archived` / `superseded-by:<id>` 阻塞生成
- **★ stale 处理**：如 onepage frontmatter 有 `stale: true`，regen 时产出 diff（vs 上一版）并清除 stale flag
- **★ diff 输出**：增删改的 sections + 新引入 / 被替换的 refs（被 supersede 的 memory **不**进 changelog）

#### Auto-memory propose（被动）

discussion 中 LLM 检测以下模式时累积候选条目（默认每 5 轮 confirm 一批）：
- 设计师陈述事实型断言（"主用户是 admin"）
- 设计师做决定（"我们不做 calling 集成"）
- 设计师纠正之前理解（"不对，是 X 不是 Y"）
- 设计师引用上下游同事 feedback（"Eng 说……"、"PM 强调……"）
- 项目内特殊术语反复出现（>=2 次）

设置（写在 `state.md` frontmatter 或全局 `designer-preferences.md`）：
- `auto_propose: true | false`（默认 `true`）
- `auto_propose_mode: per-utterance | batched`（默认 `batched`，5 轮）

#### 读触发 propose ★ v0.2 新增

除 batched 外，**事件驱动**第二条路径：LLM 在 discussion 中读 `memory/*.md` / `decisions.md` / `assumptions.md` / `state.md` 时，自动 inject 一句：

> "If you spot any entry that needs add / update / correct based on current discussion, propose now."

设计意图：batched 每 5 轮可能漏掉刚冒出的更新；读触发是事件驱动补漏。两条路径产生的 propose 走同一管道（confirm → 写入），不重复。

---

## 5. 关键模板（v0.2 新增 / 升级）

### state.md（升级 — 加 Memory Index + size cap）

```markdown
---
project: <name>
prd_source: ./pm-source.md
created: <date>
last_updated: <date>
phase: intake | analysis | discussion | closure-check | onepage-generated | handoff-ready
auto_propose: true
auto_propose_mode: batched
---

# Current Understanding
（一段话，<200 字，对需求的核心理解）

# Confirmed Decisions (top 3-5)
- D1: ... → see decisions.md

# Active Assumptions (top 3)
- A1: ... → see assumptions.md

# Open Questions (blocking only)
- Q1: ... → see questions.md

# Memory Index ★ 新增
- Stakeholders (last 3): m-abc / m-def / m-ghi → see memory/stakeholders.md
- Constraints (last 3): m-xxx / ... → see memory/constraints.md
- Terminology (last 3): m-yyy / ... → see memory/terminology.md
- History (last 3): m-zzz / ... → see memory/history.md
- Preferences (active): m-www / ... → see memory/preferences.md

# Recommended Next Step
（一句话）
```

**Size discipline**：`state.md` 正文 ≤30 行 / <1k tokens（不含 frontmatter）。每次写入前 skill 自动检查；溢出时 demote 最旧的 Memory Index 条目（条目仍保留在 `memory/<file>.md`，仅从 state.md 索引移除）。`Recommended Next Step` 永远保留。

### memory/<type>.md（统一格式 — 新增）

```markdown
---
project: <name>
type: stakeholders | constraints | terminology | history | preferences
last_updated: <date>
---

# Active

- id: m-abc123
  content: <一行>
  source: "conv-2026-05-08" | "pm-source.md:L23" | "eng-feedback-2026-05-08-slack"
  confidence: high | medium | low
  prd_version_at_write: v1
  status: active
  date: 2026-05-08

- id: m-def456
  ...

# Archived / Superseded
（status=archived 或 superseded-by:<id> 的条目下沉到此段，仍可查不删）
```

### background.md（append-only — 新增）

```markdown
---
project: <name>
created: <date>
---

# 2026-05-08 14:32 — 来自 /add-context

原始内容：
> （设计师贴的原文 / 文件引用）

提取的 memory 条目：
- m-abc123 → memory/constraints.md
- m-def456 → memory/stakeholders.md

---

# 2026-05-09 09:15 — 来自 auto-propose batch (round 5-10)

捕获的对话片段：
> ...

提取的 memory 条目：
- ...
```

### ux-onepage.md（frontmatter 升级）

```yaml
---
project: <name>
generated: <date>
prd_source: ./pm-source.md
prd_version: v1
stale: false                       # ★ 新增
stale_reason: null                 # ★ 新增
last_regen: <date>                 # ★ 新增
regen_count: 0                     # ★ 新增
---
```

`stale: true` 时 onepage 顶部自动加 banner：
> ⚠️ This onepage is stale. Reason: added m-abc123 (2026-05-08). Run `/ux-project:onepage` to regenerate.

正文章节（13 章）保持 v0.1 不变。memory 引用格式：`[ref: memory/constraints.md#m-abc123]`。

### designer-preferences.md（跨项目 — 新增）

```markdown
---
type: cross-project designer preference
last_updated: <date>
---

# Active Preferences

- id: p-001
  content: "倾向用 mermaid 可视化用户流"
  source: "conv-2026-04-20"
  date: 2026-04-20

- id: p-002
  content: "onepage 偏好简洁，不喜欢冗长背景"
  source: "conv-2026-05-02"
  date: 2026-05-02
```

写入路径：跨 ≥2 个项目反复出现的偏好（auto-propose 检测到时提示设计师"是否升级到全局 preference？"）。

---

## 6. PRD 升版的 hybrid 处理

PRD 从 v1 升到 v2 时（新建 `pm-source-v2.md`，旧版 `valid_to` 填今天 + `superseded_by`）：

```
[skill 检测到 PRD superseded]
   ↓
弹一行：
⚠️ PRD 升 v2，当前 N 条 active memory + M 条 active assumption。
   现在 review 还是 onepage regen 时再看？
   [现在 review] / [稍后]
   ↓                                   ↓
"现在 review" → force-scan          "稍后" → lazy（默认）
   ↓                                   ↓
逐条问 keep / supersede / archive    PRD 标 superseded；
                                    下次 /onepage cite-check
                                    顺带跑 status 校验
```

`auto_propose` 设置不影响 PRD 升版流程。

---

## 7. v0.2 MVP 边界

### v0.2 必须有

- [x] `/ux-project:start` 强制结构化任务总结输出
- [x] `/ux-project:add-context` 命令 + 分类提议流程
- [x] `memory/` 5 个文件 + 模板
- [x] `background.md` append-only
- [x] `state.md` 升级（Memory Index 段 + auto_propose 配置）
- [x] `ux-onepage.md` 升级（stale frontmatter + banner + diff）
- [x] auto-propose（默认 batched 每 5 轮）+ on/off 开关
- [x] PRD 升版 hybrid 提示（默认 lazy）
- [x] cite-check 升级：memory `status: active` 校验
- [x] `ux-kb-curated/designer-preferences.md` 模板
- [x] **★ state.md size cap** (≤30 行) + 自动 demote 旧 Memory Index 条目
- [x] **★ 读触发 propose**：LLM 读 memory file 时 inject 提议提示，与 batched 并行

### v0.2 不做（explicit Not Doing）

- ❌ memory 加 `owner` 字段（PM/Eng/derived）—— Q3.5 已收敛
- ❌ onepage regen changelog 列 superseded memory —— Q3.6 已收敛
- ❌ PRD 升版强扫 active memory（默认 lazy）—— Q3.4 已收敛
- ❌ memory 自动 expiry / 时间衰减 —— v0.3
- ❌ 跨项目 memory 引用（项目 A reference 项目 B 的 m-id）—— v0.3+
- ❌ 团队多设计师并发 —— v0.3+
- ❌ memory 全文搜界面（CLI 之外）—— ctx_search 即可
- ❌ background.md 自动结构化 —— append-only 即可
- ❌ stale onepage 自动 regen —— 设计师手动触发
- ❌ memory 条目协作编辑（多人）—— 单人优先

---

## 8. 待验证假设（v0.2 新增 5 条，接 v0.1 的 1-5）

| # | 假设 | 验证方式 | 失败信号 |
|---|---|---|---|
| 6 | 首响应结构化总结让设计师早期 catch LLM 误解 | 跑 3 个项目，看设计师 reject/edit 率 | 100% confirm 不改 → 总结太泛；>50% reject → 模板太死 |
| 7 | `/add-context` 流程不打断讨论节奏 | 每个项目跑 ≥5 次 add-context，记录耗时和反感 | 设计师反复 skip / 抱怨打断 |
| 8 | auto-propose batched 5 轮频率合适 | 看 confirm vs reject 比 | reject 率 >40% → 提议噪音太大；<10% → 提议太保守 |
| 9 | memory 双层（global vs project）边界清晰 | 跑 2 个项目，看条目错放率 | >20% 条目放错层 |
| 10 | stale 标记不让设计师焦虑 | 跑 1 个长项目（>2 周），看设计师手动 regen 频率 | 每次有 stale 立刻 regen → 干扰；从不 regen → 标记无意义 |
| 11 | state.md size cap 不让设计师感觉信息丢失 | 跑长项目（>3 周），看 demote 后设计师能否轻松找到旧条目 | 设计师反复抱怨"我记得有个 X 但 state.md 没了" |
| 12 | 读触发 propose confirm 率 ≥ batched | 对比两条路径各自的 confirm 率 | 读触发 confirm 率显著低于 batched → 噪音太大 |

---

## 9. Open Questions（v0.2 不解决但记下）

1. **memory 条目跨项目引用**：v0.3 是否打开？需要全局 id 体系吗？
2. **`/add-context` 多语言**：粘贴飞书 doc 常混中英，分类器准确率？
3. **auto-propose 噪音治理**：batched 5 轮是 magic number，是否设计师可调？
4. **stale 累积**：长项目可能 onepage 一直 stale 不 regen，是否需要超时强制提醒？
5. **memory ↔ KB 边界**：项目内反复确认的硬约束是否回写 KB？v0.3 双向同步话题。

---

## 10. Phase 路线图

```
Phase 0：v0.1 dogfood + v0.2 决策对齐         (1 周)
  - 跑通 v0.1 至少 1 个真实项目
  - 收集首响应、背景补充、记忆痛点的反馈

Phase 1：核心三件套实现                        (2-3 周)
  - SKILL.md 升级（**7 条新 principles** + 1 新 command）
  - /add-context 实现 + 分类器 prompt
  - memory/ 5 个模板 + 写入逻辑
  - state.md / ux-onepage.md frontmatter 升级
  - auto-propose 检测 prompt + 批次累积
  - **★ state.md size cap + 读触发 propose**（1-2 天）

Phase 2：cite-check 升级 + diff               (1 周)
  - memory status active 校验
  - onepage stale flag + banner
  - regen diff 输出

Phase 3：dogfood + 验证假设 6-12              (持续 2 周)
  - 跑 2-3 个真实项目
  - 收集反馈 → v0.3 backlog
```

**总时长估计**：v0.2 落地 = 4-6 周。

---

## 11. v0.2 与 v0.1 的对比（变更点 summary）

| v0.1 | v0.2 | 变更原因 |
|---|---|---|
| `/start` 输出"初始分析" | 强制结构化任务总结 + confirm | 设计师早期 catch LLM 误解 |
| 4 个 commands | 5 个 commands（加 `/add-context`） | 持续吸收上下游 feedback |
| project memory = 4 文件（state/decisions/assumptions/questions） | + `memory/` 5 文件 + `background.md` | discussion-memory ≠ context-memory |
| KB curated = 2 文件（glossary/design-principles） | + `designer-preferences.md` | 跨项目偏好独立追踪 |
| onepage 一次性生成 | onepage 可 regen + stale flag + diff | onepage 后还有真实 iteration |
| cite-check：PRD outdated 校验 | + memory `status: active` 校验 | superseded memory 不能进 onepage |
| PRD 升版：手动建 v2 | + hybrid review 提示（默认 lazy） | 平衡彻底 vs 疲劳 |
| 无 auto-propose 概念 | 默认 batched 每 5 轮，可关 | 减少打断，平衡主动 vs 被动 |
| state.md 无 size 约束 | ≤30 行 / <1k tokens 硬约束 + 溢出 demote | 长项目 resume 性能保障（借鉴 GenericAgent L1） |
| auto-propose 仅 batched | + 读触发 propose（事件驱动补漏） | 漏掉的及时 update（借鉴 GenericAgent read-side hint） |

**v0.1 不动的**：KB 索引脚本（`index-to-context-mode.js`）、cite-or-die 原则、ctx_search 用法、design-brief 模板、Operating Principles 1-8、4 个 v0.1 commands 的核心流程、KB 改造 Phase 0-3。

---

## 12. 下一步

1. **v0.1 dogfood**（前置）：v0.2 真正能验证假设需要 v0.1 跑过至少 1 个真实项目
2. **决策对齐**（半天）：auto-propose batched 默认值、首响应总结字段细节、memory 文件命名
3. **写 SKILL.md v0.2**（2 天）
4. **新增 5 个 memory 模板 + `background.md` + `designer-preferences.md`**（1 天）
5. **`state.md` / `ux-onepage.md` 升级**（半天）
6. **`/add-context` 实现 + 分类器 prompt**（2-3 天）
7. **auto-propose 检测 prompt + 批次累积逻辑**（2 天）
8. **★ state.md size cap + 读触发 propose 实现**（1-2 天）
9. **dogfood + 验证假设 6-12**（持续 2 周）

如有调整或补充，直接说；否则按此 v0.2 方案推进 Phase 1。
