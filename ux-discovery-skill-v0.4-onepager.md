# UX-partner v0.4 Refine Onepager

> 把 ux-discovery 从"分析助手"升级为完整的三阶段 UX discovery 工作流，参考 `idea-refine` 范式 (divergent → convergent → concrete)，每阶段强 gate，最终产出 markdown + HTML 双产物。

---

## Context

现状 (v0.3): 多轮提问推进 PRD → ux-onepage.md，已有 cite-or-die / memory / AskUserQuestion / stale detection。
缺口: 缺**显式 phase gate**、缺**用户场景发散→收敛框架**、缺**HTML 一图流**、缺**线上行为基线**、缺**IA + flow 输出**。
目标: v0.4 在保留 v0.3 全部基础设施前提下，重构为强 gate 三阶段，新增 IA/flow 能力和 HTML 一图流。

---

## 设计师 (用户) 原始需求

PRD 输入后，三个 phase 处理：

**Phase 1 — 理清 + 展开**
- 厘清 task 最终目标
- 确认所有背景知识 + **线上相关行为**（缺背景要主动问）
- 展开所有可能相关的用户场景
- **设计师确认后进入下一阶段**

**Phase 2 — Evaluate + Focus**
- 对话 / 提问 / 讨论，剔除不重要、不相关、不在 scope 内的场景
- 保留下来的需求列成 **JTBD 列表**
- 产物：**HTML 渲染**
- **设计师确认后进入下一阶段**

**Phase 3 — IA + 交互流程**
- 制定整体交互流程 + IA 架构
- **黑白线框**，不含交互与 UI 细节
- 产物：HTML，**与 Phase 2 产物合并**
- 设计师确认后输出最终 **UX-onepage.md + UX 一图流 HTML**

---

## 评估：相对 v0.3 的强项与冲突

### 强项 (保留并放大)

| # | 强项 | 价值 |
|---|---|---|
| 1 | Phase gate + designer 确认 | v0.3 多轮提问无强制 gate，这是真工作流升级 |
| 2 | HTML 一图流 | 补 stakeholder 沟通介质，markdown 对跨部门评审太弱 |
| 3 | JTBD 升为 gated 交付物 | 符合企业 UX 实际流程，v0.3 里 JTBD 只是 onepage 一节 |
| 4 | 线上行为基线 | v0.3 没有，是关键信息源 (现有方案 / 当前指标 / 用户基线) |

### 冲突 (必须解决)

| # | 冲突 | 解法 |
|---|---|---|
| 1 | Phase 3 IA 线框 vs README "Does NOT generate UI / wireframes" | 重定义边界：**IA + flow 是 in-scope (upstream 设计资产)，hi-fi UI / 视觉 / Figma 仍 out-of-scope** |
| 2 | 3 个 hard gate 可能让设计师烦 | 每个 gate 仅 1 张 AskUserQuestion 卡 (approve / revise / drill-down)；phase 内多轮提问不变 |
| 3 | HTML 渲染 vs cite-or-die | 主输出仍是 ux-onepage.md (带 cite)，HTML 是 "展示视图"；ref 用 hover tooltip 或 footnote |

### 边界重定义（关键决策）

| 维度 | v0.3 | v0.4 | 下游 (huashu-design / Figma) |
|---|---|---|---|
| IA structure | ❌ | ✅ | 消费 |
| Interaction flow | ❌ | ✅ | 消费 |
| 黑白容器级线框 | ❌ | ✅ | 细化 |
| UI 控件 / 视觉 / 颜色 | ❌ | ❌ | ✅ |
| Figma 高保真 | ❌ | ❌ | ✅ |

---

## 推荐方案：演进 ux-discovery 为 v0.4 (不新建 / 不替换)

### 三阶段 × idea-refine 范式映射

| Phase | idea-refine 范式 | 沿用 v0.3 机制 | v0.4 新增 |
|---|---|---|---|
| **1. Understand & Expand** | Divergent | memory-* 系统 / AskUserQuestion / KB 检索 | scenario expansion lenses (5个)；`memory-baseline.md` (线上行为) |
| **2. Evaluate & Converge** | Convergent | assumptions / decisions / cite-or-die | 评估 rubric (User Value × Impl Cost × Strategic Fit)；强制 "Not Doing" 列表；**HTML JTBD 卡片视图** |
| **3. Sharpen & Ship** | Concrete | template 体系 / stale detection | IA structure (HTML/CSS box)；flow diagram (Mermaid)；最终 `ux-onepage.md + ux-onepage.html` |

### Phase 1 — Scenario Expansion Lenses (类比 idea-refine 7 lens)

- **Persona shift**: 次要用户 / 管理员 / 外部相关方
- **Journey stage shift**: 触发前 / 进行中 / 触发后 / 失败后恢复
- **Edge case lens**: 数据为空 / 数据爆量 / 权限受限 / 离线
- **Error & recovery lens**: 错误路径 / 回退 / 撤销
- **Cross-context lens**: 多端 / 多角色协作 / 中断恢复

按需选用，不机械全跑。

### Phase 2 — 评估 Rubric

```
| Scenario | User Value | Impl Cost | Strategic Fit | Decision |
|----------|------------|-----------|---------------|----------|
| S1: xxx  | High       | Medium    | Core          | KEEP     |
| S2: xxx  | Low        | High      | Edge          | CUT      |
```

每个 CUT 必须进 "Not Doing" 列表并说明原因。

### Phase 3 — HTML 一图流技术栈

| 元素 | 实现 |
|---|---|
| IA tree | HTML nested div + 极简 CSS box (无外部依赖) |
| Flow diagram | Mermaid via CDN |
| JTBD cards | 纯 CSS grid card |
| Citation ref | hover tooltip 或末尾 footnote 列表 |

输出文件: **单 HTML 文件自包含**，三段连续渲染 (scenario map + JTBD cards + IA tree + flow diagram)。

---

## 落地路径 (按优先级)

1. **改 README 边界声明** — 把 IA / flow 显式划入 in-scope，UI / 视觉 / Figma 仍 out-of-scope。立 charter
2. **改 `SKILL.md`** — 重构为 3-phase 强 gate 流程，沿用现有 AskUserQuestion / memory / cite-or-die
3. **新增 `memory-baseline.template.md`** — 线上行为基线类目
4. **新增 `ux-onepage.html.template`** — 自包含、Mermaid CDN、ref footnote
5. **扩展 `ux-onepage.template.md` schema** — 加 5 节：scenario-map / jtbd-list / ia-structure / flow / not-doing
6. **新增 `/ux-project:refine` 命令** 或扩展 `/ux-project:onepage` 跑 3-phase；保留 `/ux-project:start` 不动
7. **state.md 加 phase 字段** — `current_phase: 1\|2\|3`、`phase_N_confirmed_at`；让 resume 精确回到上次 gate

---

## 待拍板的关键决策

| # | 决策点 | 选项 |
|---|---|---|
| 1 | Phase 3 边界 (**最关键**) | A. 接受 "IA/flow in-scope, UI out-of-scope" / B. Phase 3 仅 markdown + Mermaid 不画线框 |
| 2 | Skill 演进策略 | A. 升级 ux-discovery 到 v0.4 (推荐) / B. 新建并存 / C. 新建替换 |
| 3 | HTML 渲染策略 | A. 单文件自包含 + Mermaid CDN (推荐) / B. Tailwind CDN 模板 / C. Markdown + 构建脚本转 HTML |
| 4 | MD 产物策略 | A. 扩展现有 ux-onepage.md schema (推荐) / B. 新增独立 ux-flow.md / C. 重写 template 不向后兼容 |

---

## 总评

**强买入**。从"分析助手"到"完整 UX discovery 工作流"的关键跃迁。v0.3 基础设施 (memory/cite/UI 提问) 已就位，v0.4 把工作流骨架立起来。

唯一真正需要拍板的是 **Phase 3 边界**——接受 "IA/flow in-scope, UI/视觉 out-of-scope" 这条线，整个设计就顺了。否则 Phase 3 只能产 markdown + Mermaid，一图流视觉冲击力弱一半。
