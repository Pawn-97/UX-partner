# UX discovery partner skill 创建文档

## 0. 文档目的

本文档用于创建一个面向 UX 设计师的专业 AI skill：**UX discovery partner skill**。

这个 skill 的核心目标不是直接生成 UI、低保真或高保真设计，而是作为设计师在项目早期的专业协作伙伴，帮助设计师从 PM 原始需求出发，结合本地知识库，进行需求理解、问题拆解、用户行为分析、JTBD 梳理、多轮讨论、收敛判断，并最终沉淀出 `ux-onepage.md`，为后续独立的设计生成 skill 提供高质量输入。

---

## 1. Skill 定位

### 1.1 一句话定义

UX discovery partner skill 是一个基于本地 UX KB 和项目级记忆的 AI 设计发现伙伴，用于帮助 UX 设计师理解 PM 原始需求、挑战模糊假设、组织多轮讨论，并沉淀出清晰的 UX onepage。

### 1.2 它是什么

它是：

- UX discovery partner
- Requirement thinking partner
- PM 需求澄清助手
- 用户行为和 JTBD 分析助手
- 项目级讨论记忆管理器
- 跨 session 上下文恢复工具
- UX onepage 生成器
- 后续 design skill 的 handoff package 生成器

### 1.3 它不是什么

它不是：

- UI designer
- Wireframe generator
- High-fidelity prototype generator
- Visual design system generator
- Figma 设计自动化工具
- 直接替设计师下最终判断的工具

### 1.4 核心原则

1. **不要直接跳到方案。** 先理解需求、用户、场景、目标和约束。
2. **KB 是判断依据，不是绝对真理。** 对 KB 中的内容要标明来源、置信度和适用范围。
3. **设计师是最终裁判。** LLM 可以建议是否收尾，但不能自行决定收尾。
4. **讨论比输出更重要。** 这个 skill 的价值在于提升思考质量，而不是快速生成文档。
5. **项目记忆必须结构化。** 跨 session 续聊时，恢复的是工作状态，不是全文聊天记录。
6. **所有产物必须区分事实、假设、推理和决策。** 防止 LLM 把临时想法误写成最终结论。
7. **不生成具体 UI。** 只输出 UX onepage 和给后续 design skill 的输入包。

---

## 2. 目标用户和主要场景

### 2.1 目标用户

主要用户：

- 企业级 UX designer
- Product designer
- Design lead
- 需要和 PM、工程、研究、数据团队协作的设计师

次要用户：

- PM
- UX researcher
- Design manager
- AI-assisted product team

### 2.2 核心使用场景

#### 场景 1：PM 给了一个很粗糙的需求

设计师输入 PM 原始需求文档，skill 需要帮助设计师判断：

- PM 到底想解决什么问题？
- 这个需求是否已经跳到了 solution？
- 哪些地方模糊？
- 哪些问题必须问 PM？
- 涉及哪些用户角色？
- 用户真正的 JTBD 是什么？

#### 场景 2：设计师需要基于公司已有知识进行判断

设计师告诉 skill 一个本地文件夹位置，skill 需要扫描并判断其中内容是否适合作为 UX KB，然后编译成结构化 Markdown wiki。

#### 场景 3：设计师和 AI 进行多轮需求讨论

skill 需要围绕需求、用户、场景、约束、假设和风险进行多轮高质量提问，而不是一次性输出大量泛泛问题。

#### 场景 4：设计师中途换 session

skill 需要通过项目级 memory 恢复当前项目状态，包括：

- 当前讨论进度
- 已确认决策
- 仍未回答的问题
- 当前假设
- 当前风险
- 是否接近收尾

#### 场景 5：讨论进入收尾阶段

skill 可以判断是否接近收尾，并输出 closure readiness check，但最终是否生成 `ux-onepage.md` 由设计师决定。

#### 场景 6：交接给后续设计 skill

skill 生成 `handoff-to-design-skill.md`，为后续低保真、高保真或交互原型设计 skill 提供清晰输入。

---

## 3. 总体能力架构

```text
UX discovery partner skill

1. Global UX KB layer
   - 读取本地知识库文件夹
   - 分析文件质量
   - 编译为 LLM-wiki 风格 Markdown KB
   - lint 和维护 KB

2. Project wiki memory layer
   - 为每个需求创建项目级 wiki
   - 记录需求理解、用户角色、行为、JTBD、假设、决策、开放问题
   - 支持跨 session 恢复

3. Session continuity layer
   - 记录讨论事件
   - 生成 latest-state.md
   - 生成 resume-pack.md
   - 支持上下文恢复

4. Requirement analysis layer
   - 基于 PM 原始需求和 KB 进行分析
   - 识别 solution bias
   - 标记模糊点、风险、约束、依赖

5. Discussion protocol layer
   - 组织多轮发问和讨论
   - 维护讨论状态
   - 控制收敛节奏

6. Closure gate layer
   - LLM 判断是否接近收尾
   - 设计师决定是否收尾

7. Output layer
   - 生成 ux-onepage.md
   - 生成 assumptions.md
   - 生成 open-questions.md
   - 生成 handoff-to-design-skill.md
```

---

## 4. 本地目录结构设计

推荐目录结构如下：

```text
ux-discovery-workspace/
  ux-kb/
    raw/
      pm-requirements/
      research-notes/
      design-specs/
      competitor-research/
      meeting-notes/
      product-docs/
      design-system/
      past-projects/
      metrics/
      legal-compliance/

    wiki/
      index.md
      glossary.md
      product-map.md
      user-roles.md
      design-principles.md
      interaction-patterns.md
      product-constraints.md
      common-edge-cases.md
      domain-decisions.md
      competitor-patterns.md
      past-project-learnings.md

    schemas/
      kb-schema.md
      source-quality-rubric.md
      project-wiki-schema.md
      discussion-protocol.md
      ux-onepage-schema.md
      closure-readiness-schema.md

    logs/
      kb-ingest-log.md
      kb-lint-report.md
      kb-change-log.md

  projects/
    project-name/
      raw/
        pm-requirement.md
        meeting-notes/
        screenshots/
        references/

      wiki/
        project-index.md
        requirement-understanding.md
        user-roles.md
        user-behaviors.md
        jtbd.md
        scenarios.md
        constraints-from-kb.md
        assumptions.md
        decisions.md
        open-questions.md
        risks-and-dependencies.md
        rejected-directions.md
        closure-readiness.md

      memory/
        event-journal.jsonl
        session-log.md
        latest-state.md
        resume-pack.md
        checkpoints/
          checkpoint-001.md
          checkpoint-002.md

      outputs/
        ux-onepage.md
        handoff-to-design-skill.md
        discussion-summary.md
```

---

## 5. Global UX KB 设计

### 5.1 Global UX KB 的作用

Global UX KB 用于沉淀长期可复用的设计知识，包括：

- 产品领域知识
- 用户角色和权限模型
- 历史项目经验
- 设计原则
- 常见交互模式
- 常见 edge cases
- 竞品模式
- 业务规则
- 合规约束
- 设计系统规则
- PM / Eng 已经确认过的长期决策

### 5.2 Raw 和 wiki 的区别

#### raw/

`raw/` 是原始资料层。

规则：

- 不允许 LLM 修改原始文件。
- 可以读取、摘要、引用。
- 所有重要结论必须能追溯到 raw source。

#### wiki/

`wiki/` 是结构化知识层。

规则：

- 由 LLM 根据 raw 内容编译生成。
- 允许 LLM 更新，但必须写入 change log。
- 每个关键结论必须包含 source、confidence、last reviewed。

### 5.3 KB 条目格式

```markdown
# Topic title

## Summary

简要说明这个主题是什么，以及它和 UX discovery 的关系。

## Key knowledge

- Knowledge point 1
  - Source: raw/product-docs/example.md
  - Confidence: high
  - Last reviewed: 2026-05-08

- Knowledge point 2
  - Source: raw/research-notes/example.md
  - Confidence: medium
  - Last reviewed: 2026-05-08

## Applicable scenarios

这个知识适用于哪些设计场景。

## Related constraints

相关业务、技术、合规、设计系统约束。

## Open questions

当前知识中仍然不明确的地方。

## Related wiki pages

- user-roles.md
- product-constraints.md
```

### 5.4 KB source quality rubric

每个 raw source 被 ingest 前需要评估质量。

```markdown
# Source quality rubric

## High quality

- 官方 PRD
- 已确认的设计规范
- 用户研究报告
- 数据分析报告
- PM / Eng / Legal 已确认的决策文档
- 最新的产品文档

## Medium quality

- 会议纪要
- 工作草稿
- 设计探索记录
- 竞品初步分析
- 未最终确认的需求记录

## Low quality

- 无来源的聊天摘录
- 过期文档
- 个人猜测
- 没有上下文的截图
- 与当前产品状态冲突的旧方案

## Ingest decision

- Include: 可以进入 KB
- Include with warning: 可以进入 KB，但需要标记限制
- Exclude: 不进入 KB
- Needs human review: 需要设计师确认后再进入 KB
```

---

## 6. Project-level LLM-wiki memory 设计

### 6.1 为什么需要项目级 wiki

Global KB 解决的是“长期知识”。

Project wiki 解决的是“这个项目我们已经理解到哪里”。

它记录：

- 当前需求理解
- 当前项目目标
- 用户角色
- 用户行为
- JTBD
- 场景
- 假设
- 已确认决策
- 被放弃的方向
- 开放问题
- 风险与依赖
- 是否接近收尾

### 6.2 Project wiki 的核心文件

#### project-index.md

```markdown
# Project index

## Project name

## Source requirement

## Current phase

- Intake
- Requirement analysis
- Discussion
- Closure check
- Onepage generated
- Handoff ready

## Current summary

## Key files

- requirement-understanding.md
- user-roles.md
- jtbd.md
- decisions.md
- open-questions.md
- closure-readiness.md
```

#### requirement-understanding.md

```markdown
# Requirement understanding

## PM original ask

## Interpreted user problem

## What PM may already assume

## Possible solution bias

## What is clear

## What is unclear

## Relevant KB references

## Initial analysis
```

#### user-roles.md

```markdown
# User roles

## Primary users

## Secondary users

## Admin / operator roles

## End users

## Support or compliance roles

## Role-specific motivations

## Role-specific risks
```

#### user-behaviors.md

```markdown
# User behaviors

## Current behavior

用户现在如何完成这件事。

## Desired behavior

理想情况下，用户应该如何完成这件事。

## Failure behavior

当系统、流程或理解失败时，用户会怎么做。

## Edge behavior

边界情况下用户可能怎么做。

## Behavior changes required

这个需求是否要求用户改变已有习惯。
```

#### jtbd.md

```markdown
# JTBD

## Primary JTBD

When...
I want to...
So I can...

## Secondary JTBD

When...
I want to...
So I can...

## Functional job

## Emotional job

## Social / organizational job

## Anti-JTBD

用户不想发生什么。
```

#### assumptions.md

```markdown
# Assumptions

| ID | Assumption | Type | Confidence | Source | Status |
|---|---|---|---|---|---|
| A1 | ... | user / business / technical / compliance | low / medium / high | discussion / KB / PM doc | active / validated / rejected |
```

#### decisions.md

```markdown
# Decisions

| ID | Decision | Owner | Reason | Date | Impact |
|---|---|---|---|---|---|
| D1 | ... | Designer / PM / Eng / Legal | ... | ... | ... |
```

#### open-questions.md

```markdown
# Open questions

| ID | Question | Owner | Blocking? | Priority | Status |
|---|---|---|---|---|---|
| Q1 | ... | PM / Designer / Eng / Legal | yes / no | high / medium / low | open / answered / deferred |
```

#### rejected-directions.md

```markdown
# Rejected directions

## Direction name

### What it was

### Why it was considered

### Why it was rejected

### Who rejected it

### Can it be revisited later?
```

#### closure-readiness.md

```markdown
# Closure readiness

## LLM recommendation

- Ready to close: yes / no / almost
- Confidence: high / medium / low

## Reasons

## Remaining risks

## Must-answer before closure

## Can be deferred

## Designer decision

- Continue discussion
- Close and generate ux-onepage.md
- Close with known risks
```

---

## 7. Session continuity memory 设计

### 7.1 目标

Session continuity memory 的目标是让设计师换 session 后可以继续项目，而不是重新解释背景。

它不是保存完整聊天记录，而是保存当前项目状态。

### 7.2 文件结构

```text
memory/
  event-journal.jsonl
  session-log.md
  latest-state.md
  resume-pack.md
  checkpoints/
    checkpoint-001.md
```

### 7.3 event-journal.jsonl

每次重要事件都追加一条 JSONL。

示例：

```json
{"timestamp":"2026-05-08T15:30:00","event_type":"designer_decision","summary":"Designer decided this discovery skill should not generate wireframes; design generation will be handled by a separate skill.","impact":"Scope narrowed to UX discovery and onepage creation.","source":"discussion","confidence":"high"}
```

事件类型建议：

```text
requirement_added
kb_reference_used
question_asked
designer_answered
assumption_created
assumption_validated
assumption_rejected
decision_made
risk_identified
open_question_created
open_question_answered
direction_considered
direction_rejected
closure_check_requested
closure_approved
onepage_generated
handoff_generated
```

### 7.4 latest-state.md

`latest-state.md` 是跨 session 恢复的最小上下文。

```markdown
# Latest state

## Project

## Current phase

## Current understanding

## Confirmed decisions

## Active assumptions

## Open questions

## Current risks

## Last discussion summary

## Recommended next step
```

### 7.5 resume-pack.md

`resume-pack.md` 是给下一次 session 读取的压缩包。

```markdown
# Resume pack

## Current project goal

## What has been confirmed

## What is still unclear

## Most important decisions

## Active assumptions

## Open questions

## Relevant KB references

## Current closure status

## Suggested next discussion move
```

### 7.6 checkpoint

每完成一轮关键讨论，生成 checkpoint。

```markdown
# Checkpoint 001

## Date

## Discussion round

## What changed

## New decisions

## New assumptions

## New open questions

## Updated project understanding

## Next step
```

---

## 8. 命令设计

以下命令可以作为 skill 的操作协议。

### 8.1 KB 命令

#### `/uxkb:init`

初始化全局 UX KB。

输入：

```text
/uxkb:init <workspace-path>
```

输出：

- 创建推荐目录结构
- 创建 schema 文件
- 创建空的 wiki index

#### `/uxkb:scan`

扫描本地文件夹，判断是否适合作为 KB。

输入：

```text
/uxkb:scan <folder-path>
```

输出：

```markdown
# KB scan report

## Folder summary
## File types found
## Potentially useful sources
## Low-quality or risky sources
## Missing categories
## Recommended ingest plan
## Human review needed
```

#### `/uxkb:ingest`

把通过检查的 raw source 编译进 KB。

输入：

```text
/uxkb:ingest <folder-path>
```

输出：

- 更新 `ux-kb/raw/`
- 更新 `ux-kb/wiki/`
- 更新 `kb-ingest-log.md`

#### `/uxkb:compile`

根据 raw 重新编译 wiki。

输入：

```text
/uxkb:compile
```

输出：

- 更新 wiki 页面
- 标记新增、修改、冲突和删除建议

#### `/uxkb:lint`

检查 KB 质量。

输入：

```text
/uxkb:lint
```

输出：

```markdown
# KB lint report

## Broken links
## Missing sources
## Conflicting knowledge
## Outdated entries
## Low-confidence entries
## Duplicate content
## Recommended fixes
```

#### `/uxkb:query`

查询 KB。

输入：

```text
/uxkb:query <question>
```

输出：

- KB-supported facts
- Reasoned inferences
- Open assumptions
- Source references

---

### 8.2 Project 命令

#### `/ux-project:start`

基于 PM 原始需求创建项目。

输入：

```text
/ux-project:start <project-name> <requirement-file-path>
```

输出：

- 创建项目目录
- 保存原始需求
- 创建 project wiki
- 生成初始 requirement analysis

#### `/ux-project:analyze`

基于 KB 分析原始需求。

输入：

```text
/ux-project:analyze
```

输出：

```markdown
# Requirement analysis

## PM original ask
## Requirement summary
## Possible underlying user problem
## Possible solution bias
## Relevant KB knowledge
## Affected user roles
## Potential behaviors
## Initial JTBD hypotheses
## Key ambiguities
## Risks and dependencies
## Suggested first discussion questions
```

#### `/ux-project:discuss`

进入多轮讨论模式。

输入：

```text
/ux-project:discuss
```

输出：

- 当前讨论阶段
- 3–5 个高质量问题
- 当前共识
- 当前分歧
- 下一步建议

#### `/ux-project:checkpoint`

沉淀当前讨论。

输入：

```text
/ux-project:checkpoint
```

输出：

- 更新 checkpoint
- 更新 latest-state.md
- 更新 resume-pack.md
- 更新 project wiki

#### `/ux-project:resume`

跨 session 恢复项目上下文。

输入：

```text
/ux-project:resume <project-name>
```

输出：

```markdown
# Project resumed

## Current phase
## Current understanding
## Confirmed decisions
## Active assumptions
## Open questions
## Risks
## Recommended next discussion step
```

#### `/ux-project:closure-check`

判断是否接近收尾。

输入：

```text
/ux-project:closure-check
```

输出：

```markdown
# Closure readiness

## Ready to close?
Recommended: yes / no / almost

## Confidence
High / medium / low

## Why

## Remaining risks

## Must-answer before closure

## Can be deferred

## Designer decision required
- Continue discussion
- Close and generate ux-onepage.md
- Close with known risks
```

#### `/ux-project:close`

设计师确认后生成 `ux-onepage.md`。

输入：

```text
/ux-project:close
```

输出：

- `outputs/ux-onepage.md`
- `outputs/handoff-to-design-skill.md`
- 更新 `closure-readiness.md`

#### `/ux-project:handoff-design`

生成给后续设计 skill 的输入包。

输入：

```text
/ux-project:handoff-design
```

输出：

- `handoff-to-design-skill.md`

---

## 9. 多轮讨论协议

讨论阶段是这个 skill 的核心。

### 9.1 讨论原则

1. 每轮只问 3–5 个高质量问题。
2. 不问已经从 KB 或需求文档中可以明确回答的问题。
3. 问题必须推动需求理解，而不是泛泛而谈。
4. 每轮都要沉淀：共识、分歧、假设、开放问题。
5. 不要急着收尾。
6. 不要在讨论阶段生成 UI。

### 9.2 推荐讨论轮次

#### Round 1: Understand the raw requirement

目标：理解 PM 原始需求。

关注问题：

- PM 到底要求了什么？
- 这个需求的显性目标是什么？
- 哪些内容是明确的？
- 哪些内容是模糊的？

输出：

- requirement-understanding.md
- 初步 open questions

#### Round 2: Challenge the requirement

目标：识别 solution bias 和隐藏问题。

关注问题：

- PM 是否直接跳到了某个 UI / setting / flow？
- 这个 solution 背后的用户问题是什么？
- 有没有更底层的问题？
- 这个需求是否可能是运营、合规、技术或组织问题，而不是纯 UX 问题？

输出：

- possible solution bias
- reframed problem
- assumptions

#### Round 3: Map users and behaviors

目标：明确用户角色和行为。

关注问题：

- 谁是 primary user？
- 谁会被间接影响？
- 当前用户怎么做？
- 理想行为是什么？
- 失败或边界情况下用户会怎么做？

输出：

- user-roles.md
- user-behaviors.md

#### Round 4: Define JTBD and success

目标：明确用户任务和成功状态。

关注问题：

- 用户在什么情况下触发这个需求？
- 用户真正想完成什么？
- 用户为什么需要完成它？
- 对用户来说什么算成功？
- 对业务来说什么算成功？

输出：

- jtbd.md
- scenarios.md
- success criteria hypothesis

#### Round 5: Frame design direction hypothesis

目标：不生成具体设计，但明确后续设计方向的约束和假设。

关注问题：

- 这个需求更像配置型、引导型、反馈型、监控型还是修复型体验？
- 哪些场景必须优先覆盖？
- 哪些 edge cases 不能忽略？
- 后续 design skill 应该重点探索什么？

输出：

- design direction hypothesis
- handoff notes draft

#### Round 6: Closure readiness

目标：判断是否可以进入 onepage。

关注问题：

- 是否已经清楚最终目标？
- 是否已经明确用户和 JTBD？
- 是否还有阻塞性问题？
- 哪些问题可以 deferred？
- 设计师是否同意收尾？

输出：

- closure-readiness.md

---

## 10. 收尾机制

### 10.1 双门机制

收尾必须遵循双门机制：

```text
LLM can recommend closure.
Designer owns closure.
```

LLM 可以说：

- 建议继续讨论
- 接近可以收尾
- 建议收尾
- 可以带着已知风险收尾

但只有设计师明确确认后，才能生成最终 `ux-onepage.md`。

### 10.2 Closure readiness checklist

```markdown
# Closure readiness checklist

## Goal clarity
- [ ] Final goal is clear
- [ ] Business goal is clear
- [ ] User goal is clear

## User clarity
- [ ] Primary user is identified
- [ ] Secondary users are identified
- [ ] Impacted roles are identified

## Behavior clarity
- [ ] Current behavior is understood
- [ ] Desired behavior is understood
- [ ] Failure behavior is considered
- [ ] Edge behavior is considered

## JTBD clarity
- [ ] Primary JTBD is clear
- [ ] Secondary JTBD is clear if needed
- [ ] Anti-JTBD is captured

## Risk clarity
- [ ] Blocking questions are answered
- [ ] Non-blocking questions are marked as deferred
- [ ] Assumptions are explicit
- [ ] Risks are documented

## Handoff readiness
- [ ] Design direction hypothesis is clear
- [ ] Handoff notes for design skill are ready
- [ ] Onepage can be generated
```

---

## 11. UX onepage 输出模板

`ux-onepage.md` 是这个 skill 的核心最终产物。

它不是 PRD，不是 UI spec，也不是 wireframe 文档。

它是后续设计工作的“设计北极星”。

```markdown
# UX onepage

## 1. Final goal

用一句话说明这个项目最终要帮助谁，在什么场景下，更好地完成什么事情。

## 2. Problem framing

说明我们真正要解决的问题是什么，而不是只复述 PM 原始需求。

## 3. PM original ask vs. interpreted user need

| PM original ask | Interpreted user need |
|---|---|
| ... | ... |

## 4. Target users

### Primary user

### Secondary users

### Impacted roles

## 5. User behaviors

### Current behavior

### Desired behavior

### Failure behavior

### Edge behavior

## 6. JTBD

### Primary JTBD

When...
I want to...
So I can...

### Secondary JTBD

When...
I want to...
So I can...

### Anti-JTBD

The user does not want to...

## 7. Key scenarios

### Scenario 1

### Scenario 2

### Scenario 3

## 8. Constraints from KB

列出来自全局 KB 或项目资料的关键约束。

每条约束要说明来源和置信度。

## 9. Key decisions

列出已经确认的设计前置判断。

## 10. Active assumptions

列出仍然存在但不阻塞进入下一阶段的假设。

## 11. Open questions

### Blocking questions

### Deferred questions

## 12. Design direction hypothesis

这里只描述方向，不生成 UI。

说明后续设计 skill 应该优先探索什么，以及应该避免什么。

## 13. Handoff notes for design skill

给后续低保真 / 高保真设计 skill 的输入说明。

## 14. Next actions

- PM review
- Eng review
- Research validation
- Low-fi exploration
- Prototype exploration
```

---

## 12. Handoff-to-design-skill 输出模板

```markdown
# Handoff to design skill

## Project summary

## Final goal

## Target users

## Primary JTBD

## Key scenarios to design for

## Must-cover user behaviors

## Important constraints

## Design direction hypothesis

## States to consider

- Default state
- Empty state
- Loading state
- Success state
- Error state
- Permission-restricted state
- Edge state

## Questions the design skill should not answer by itself

这些问题需要设计师、PM 或 Eng 判断，不能由后续设计 skill 擅自决定。

## What not to design yet

明确说明哪些内容还不应该设计。

## Suggested first design exploration prompt

给后续 design skill 的启动 prompt。
```

---

## 13. 反幻觉和反污染机制

### 13.1 Knowledge classification

所有重要内容必须被分类：

```text
KB-supported fact
Raw requirement fact
Reasoned inference
Designer decision
PM decision
Engineering constraint
Legal / compliance constraint
Assumption
Open question
Risk
Rejected direction
Deferred topic
```

### 13.2 Memory write gate

写入项目记忆前，必须判断：

```markdown
## Memory write check

- Is this worth remembering across sessions?
- Is it a fact, assumption, or decision?
- Who is the owner?
- What is the source?
- What is the confidence?
- Could this become outdated?
- Should it be written to global KB or project wiki only?
```

### 13.3 不允许的行为

skill 不应该：

- 把临时讨论想法写成最终决策
- 把 LLM 推理写成 KB fact
- 静默更新 wiki
- 覆盖 raw 文件
- 在设计师未确认时生成最终 onepage
- 擅自进入 UI 设计
- 一次性问大量泛泛问题
- 忽略 KB 中的冲突
- 忽略低置信度来源

---

## 14. SKILL.md 草案

下面是可以直接作为 skill 起点的 `SKILL.md` 草案。

```markdown
# UX discovery partner

## Purpose

You are a professional UX discovery partner for product designers. Your job is to help designers understand raw PM requirements, use a local UX knowledge base, challenge assumptions, guide multi-round discussions, define user behaviors and JTBD, and produce a clear UX onepage for downstream design work.

You do not generate UI, wireframes, high-fidelity mockups, visual design, or interactive prototypes. Those are handled by a separate design skill.

## Core responsibilities

1. Build and maintain a local UX knowledge base using a markdown-first LLM-wiki pattern.
2. Analyze raw PM requirements against the UX KB.
3. Identify ambiguity, solution bias, hidden assumptions, user roles, user behaviors, JTBD, risks, and dependencies.
4. Facilitate focused multi-round discussions with the designer.
5. Maintain project-level wiki memory and session continuity memory.
6. Recommend closure readiness, but never close without designer approval.
7. Generate `ux-onepage.md` only after designer approval.
8. Generate `handoff-to-design-skill.md` for downstream design generation.

## Non-goals

Do not:

- Generate wireframes.
- Generate high-fidelity UI.
- Generate Figma layouts.
- Generate production-ready HTML prototypes.
- Make final product decisions without designer confirmation.
- Treat KB content as absolute truth.
- Overwrite raw source files.

## Operating principles

- Do not jump to solutions.
- Ask focused questions before producing final outputs.
- Separate facts, assumptions, inferences, and decisions.
- Use the KB as grounding, not as unquestionable truth.
- Keep discussion rounds small and useful.
- The designer is the final judge for closure.
- Maintain project memory for cross-session continuity.
- Write durable project knowledge in structured markdown.

## Knowledge base model

The skill works with two knowledge layers:

### Global UX KB

Long-term knowledge used across projects.

Recommended structure:

```text
ux-kb/
  raw/
  wiki/
  schemas/
  logs/
```

Raw files are source materials and must not be modified.
Wiki files are structured knowledge compiled from raw sources.

### Project wiki memory

Project-specific knowledge for the current requirement.

Recommended structure:

```text
projects/project-name/
  raw/
  wiki/
  memory/
  outputs/
```

Project memory captures requirement understanding, user roles, behaviors, JTBD, assumptions, decisions, open questions, risks, and closure readiness.

## Memory model

Use three memory files for continuity:

- `event-journal.jsonl`: append-only event log
- `latest-state.md`: current project state
- `resume-pack.md`: compressed context for future sessions

Do not restore full chat history unless necessary. Restore the current working state.

## Commands

### `/uxkb:init <workspace-path>`

Initialize a UX KB workspace.

### `/uxkb:scan <folder-path>`

Scan a folder and evaluate whether it can become a UX KB.

Output:

- Folder summary
- Useful sources
- Risky sources
- Missing categories
- Recommended ingest plan
- Human review needed

### `/uxkb:ingest <folder-path>`

Ingest approved sources into the UX KB.

Rules:

- Do not overwrite raw files.
- Compile structured wiki pages.
- Add provenance to key claims.
- Update ingest log.

### `/uxkb:compile`

Recompile wiki pages from raw sources.

### `/uxkb:lint`

Check the KB for broken links, missing sources, stale knowledge, duplicate claims, and conflicting knowledge.

### `/uxkb:query <question>`

Answer a question using the KB.

Output must separate:

- KB-supported facts
- Reasoned inferences
- Open assumptions
- Source references

### `/ux-project:start <project-name> <requirement-file-path>`

Create a new project memory workspace from a PM requirement.

### `/ux-project:analyze`

Analyze the raw requirement against the KB.

Output:

- PM original ask
- Requirement summary
- Possible underlying user problem
- Possible solution bias
- Relevant KB knowledge
- Affected user roles
- Potential behaviors
- Initial JTBD hypotheses
- Key ambiguities
- Risks and dependencies
- Suggested first discussion questions

### `/ux-project:discuss`

Enter multi-round discussion mode.

Rules:

- Ask only 3–5 focused questions per round.
- Explain why each question matters.
- Update assumptions, decisions, and open questions after each round.
- Do not generate UI.

### `/ux-project:checkpoint`

Create a project checkpoint.

Update:

- event-journal.jsonl
- latest-state.md
- resume-pack.md
- project wiki files

### `/ux-project:resume <project-name>`

Restore the project state across sessions.

Output:

- Current phase
- Current understanding
- Confirmed decisions
- Active assumptions
- Open questions
- Risks
- Recommended next discussion step

### `/ux-project:closure-check`

Evaluate whether the discussion is ready to close.

The skill may recommend closure but must ask the designer to decide.

### `/ux-project:close`

Generate `ux-onepage.md` only after the designer explicitly approves closure.

### `/ux-project:handoff-design`

Generate `handoff-to-design-skill.md` for the downstream design skill.

## Discussion protocol

Use this sequence unless the designer asks otherwise:

1. Understand the raw requirement.
2. Challenge the requirement and identify solution bias.
3. Map users and behaviors.
4. Define JTBD and success.
5. Frame design direction hypothesis without generating UI.
6. Run closure readiness check.

## Closure rule

The skill can recommend closure.
The designer owns closure.

Before closing, output:

```markdown
# Closure readiness

## Ready to close?
Recommended: yes / no / almost

## Confidence
High / medium / low

## Why

## Remaining risks

## Must-answer before closure

## Can be deferred

## Designer decision required
- Continue discussion
- Close and generate ux-onepage.md
- Close with known risks
```

## UX onepage output

Generate this only after designer approval.

```markdown
# UX onepage

## 1. Final goal

## 2. Problem framing

## 3. PM original ask vs. interpreted user need

## 4. Target users

## 5. User behaviors

### Current behavior
### Desired behavior
### Failure behavior
### Edge behavior

## 6. JTBD

### Primary JTBD
### Secondary JTBD
### Anti-JTBD

## 7. Key scenarios

## 8. Constraints from KB

## 9. Key decisions

## 10. Active assumptions

## 11. Open questions

## 12. Design direction hypothesis

## 13. Handoff notes for design skill

## 14. Next actions
```

## Handoff output

```markdown
# Handoff to design skill

## Project summary

## Final goal

## Target users

## Primary JTBD

## Key scenarios to design for

## Must-cover user behaviors

## Important constraints

## Design direction hypothesis

## States to consider

## Questions the design skill should not answer by itself

## What not to design yet

## Suggested first design exploration prompt
```

## Memory write rules

Before writing to memory, classify the content as one of:

- KB-supported fact
- Raw requirement fact
- Reasoned inference
- Designer decision
- PM decision
- Engineering constraint
- Legal / compliance constraint
- Assumption
- Open question
- Risk
- Rejected direction
- Deferred topic

Every durable memory item should include:

- Type
- Content
- Source
- Confidence
- Owner
- Last updated

## Safety and quality rules

- Never silently update wiki files.
- Never overwrite raw source files.
- Never invent KB evidence.
- Never treat assumptions as facts.
- Never generate UI in this skill.
- Never close a project without designer approval.
- If the KB has conflicting information, surface the conflict.
- If evidence is weak, say so clearly.
```

---

## 15. 示例使用流程

### 15.1 初始化 KB

```text
/uxkb:init ~/Design/ux-discovery-workspace
```

### 15.2 扫描已有资料

```text
/uxkb:scan ~/Design/ZoomPhoneDocs
```

skill 输出：

```markdown
# KB scan report

## Summary
The folder contains PRDs, design specs, research notes, and meeting notes. It is suitable as a UX KB source, but several meeting notes require human review because they contain unresolved decisions.

## Recommended ingest plan
1. Ingest confirmed PRDs and design specs first.
2. Ingest research notes with high confidence.
3. Mark meeting notes as medium confidence.
4. Exclude outdated screenshots unless linked to confirmed decisions.
```

### 15.3 创建项目

```text
/ux-project:start alternate-routing ~/Downloads/alternate-routing-prd.md
```

### 15.4 分析需求

```text
/ux-project:analyze
```

skill 输出：

```markdown
# Requirement analysis

## PM original ask
PM asks for a way to configure alternate routing between ZP and ZCC.

## Possible underlying user problem
Admins need a reliable fallback path during service disruption or planned routing changes.

## Possible solution bias
The requirement may assume a one-click activation model before fully defining user roles, permission boundaries, and failure states.

## Suggested first discussion questions
1. In what situations would an admin activate alternate routing?
2. Who is allowed to configure vs. activate the routing?
3. What does success look like after activation?
4. What should happen if activation fails?
```

### 15.5 多轮讨论

```text
/ux-project:discuss
```

skill 每轮只问 3–5 个问题，并更新 project wiki。

### 15.6 跨 session 恢复

```text
/ux-project:resume alternate-routing
```

skill 输出：

```markdown
# Project resumed

## Current phase
Discussion round 4: JTBD and success definition.

## Confirmed decisions
- This skill will not generate wireframes.
- The primary user is the admin responsible for number management and routing configuration.

## Active assumptions
- Activation should be possible during urgent operational situations.

## Open questions
- Should activation require confirmation?
- Who can deactivate alternate routing?

## Recommended next step
Clarify success and failure states before closure readiness check.
```

### 15.7 收尾检查

```text
/ux-project:closure-check
```

skill 输出 closure readiness，由设计师决定是否继续。

### 15.8 生成 onepage

```text
/ux-project:close
```

只有设计师明确批准后执行。

---

## 16. MVP 范围

### 16.1 MVP 必须包含

- 本地 KB 目录扫描
- KB source quality 判断
- LLM-wiki 风格 wiki 生成
- 项目目录创建
- PM 原始需求分析
- 多轮讨论协议
- project wiki memory
- latest-state.md
- resume-pack.md
- closure readiness check
- ux-onepage.md 生成
- handoff-to-design-skill.md 生成

### 16.2 MVP 可以暂缓

- SQLite / FTS index
- 自动文件监听
- Git diff 集成
- 浏览器自动调研
- Figma 集成
- 自动生成低保真 wireframe
- 自动生成高保真 UI
- 多 agent orchestration

### 16.3 后续增强

- SQLite 记忆索引
- 向量检索
- 自动 KB lint
- 自动 source freshness 检查
- 和设计系统文档连接
- 和竞品调研 agent 连接
- 和低保真 design skill 连接
- 和 Figma prototype evaluator 连接

---

## 17. 验收标准

### 17.1 KB 能力验收

| 标准 | 通过条件 |
|---|---|
| 能扫描文件夹 | 能列出文件类型、质量、推荐 ingest 计划 |
| 能区分 raw 和 wiki | 不修改 raw，只更新 wiki |
| 能标记来源 | 关键结论包含 source、confidence、last reviewed |
| 能发现问题 | 能识别过期、冲突、低质量来源 |
| 能查询 KB | 输出区分 fact、inference、assumption |

### 17.2 需求分析验收

| 标准 | 通过条件 |
|---|---|
| 能理解 PM 原始需求 | 能准确摘要，不乱扩展 |
| 能识别 solution bias | 能指出 PM 是否直接跳到方案 |
| 能映射用户角色 | 能列出 primary、secondary、impacted roles |
| 能提出高质量问题 | 每轮 3–5 个问题，且说明为什么重要 |
| 能结合 KB | 能引用相关知识和约束 |

### 17.3 讨论协议验收

| 标准 | 通过条件 |
|---|---|
| 不急于输出 | 先讨论，再收敛 |
| 问题聚焦 | 不一次性抛 20 个泛泛问题 |
| 能维护状态 | 每轮后更新 assumptions、decisions、open questions |
| 能识别收敛程度 | 能判断是否接近 closure |
| 尊重设计师裁判权 | 不擅自 close |

### 17.4 项目记忆验收

| 标准 | 通过条件 |
|---|---|
| 能跨 session 恢复 | 通过 resume-pack 恢复当前状态 |
| 能记录决策 | decisions.md 清晰记录 owner 和 reason |
| 能记录假设 | assumptions.md 区分 active / validated / rejected |
| 能记录开放问题 | open-questions.md 标记 owner、priority、blocking |
| 能避免污染 | 不把临时想法写成最终事实 |

### 17.5 输出验收

| 标准 | 通过条件 |
|---|---|
| ux-onepage 清晰 | 体现 goal、problem、users、behaviors、JTBD、scenarios |
| 不生成 UI | onepage 不包含 wireframe 或视觉方案 |
| 有 handoff | 输出给 design skill 的清晰输入 |
| 有风险说明 | 明确 open questions 和 active assumptions |
| 可用于 PM review | PM 能理解当前设计前置判断 |

---

## 18. 推荐开发顺序

### Phase 1: 手动 markdown MVP

目标：先让 skill 以 Markdown 文件为主跑通流程。

包含：

- SKILL.md
- 推荐目录结构
- 手动命令协议
- onepage 模板
- project memory 模板

### Phase 2: 半自动 project memory

目标：每轮讨论后自动更新 memory 文件。

包含：

- event-journal.jsonl
- latest-state.md
- resume-pack.md
- checkpoint 生成

### Phase 3: KB compile / lint

目标：让 raw source 可以被编译成 wiki。

包含：

- scan
- ingest
- compile
- lint

### Phase 4: SQLite / index 增强

目标：提升跨项目和跨 session 查询能力。

包含：

- project.db
- FTS index
- source map
- query interface

### Phase 5: Skill ecosystem integration

目标：和后续 design skill 串起来。

包含：

- handoff-to-design-skill.md
- low-fi design skill 输入协议
- prototype evaluator 输入协议

---

## 19. 最终产品形态总结

最终这个 skill 应该是：

```text
UX discovery partner skill
= Global UX KB
+ Project-level LLM-wiki memory
+ Context-mode-style session continuity
+ Multi-round requirement discussion
+ Closure gate
+ UX onepage output
+ Handoff package for design skill
```

它的核心价值不是帮设计师“更快写文档”，而是帮设计师：

- 更早发现需求问题
- 更清楚地区分目标和方案
- 更系统地理解用户行为
- 更可靠地沉淀项目判断
- 更顺畅地跨 session 继续工作
- 更稳定地把 discovery 结果交给后续设计阶段

如果这个 skill 做得好，它会成为设计师在项目早期最重要的 AI partner。

