# Swiss IKB · 单页排版纪律（ux-partner 适配）

> ux-partner 输出**单页滚动文档**，不是 slide deck。
> 本文档把 guizang Swiss 的设计语言翻译成单页场景下可执行的规则。
> 直接服务 `.claude-plugin/templates/ux-onepage.html.template`。

## 网格

- 容器 `max-width: 1180px`，居中
- 内边距 `clamp(20px, 4vw, 56px)` 左右，顶部 `clamp(32px, 6vw, 72px)`
- section 间距 `clamp(48px, 7vw, 96px)`（呼吸感是 Swiss 的命）
- section 内部 12 列 grid（必要时跨列）

## 字号阶梯

| 角色 | 字号 |
|---|---|
| Hero 标题（项目名） | `clamp(40px, 6.4vw, 88px)` ExtraLight 200，`line-height: 0.94`，`letter-spacing: -0.025em` |
| §1 Goal statement | `clamp(22px, 2.6vw, 36px)` Light 300，`line-height: 1.25` |
| h2 区块标题 | `clamp(20px, 2vw, 28px)` Light 300 |
| h3 / 小标题 | `13px` SemiBold 600 + uppercase + `letter-spacing: 0.14em` |
| 正文 | `14px` / `line-height: 1.6` |
| 表格 / mono 数字 | `12px` JetBrains Mono |
| kicker | `11px` SemiBold 600 + uppercase + `letter-spacing: 0.22em` |

## 颜色用量预算

| 元素 | 颜色 |
|---|---|
| Hero kicker / Hero rule | `--accent` IKB |
| Goal 左侧粗 rule（8px） | `--accent` IKB |
| 章节序号 01–08 | `--accent` IKB |
| 表格 KEEP 单元格 | `--accent` IKB 文字 + 600 |
| JTBD priority 实色块（仅 Primary） | `--accent` IKB 背景 + `--accent-on` 白字 |
| Mermaid 节点边框（新节点） | `--accent` IKB |
| 其余分隔 / 边框 / 次级文字 | `--grey-1/2/3` |
| 错误页面（线划）/ CUT | `--grey-3` + line-through |

整页 IKB 实色块**不超过 3 处**。其余 IKB 都是文字或 1–2px 线。

## 不变项（来自上游 Swiss 纪律）

1. 直角，无圆角，无阴影，无渐变
2. 单一锚点色（IKB）
3. ExtraLight 巨字 + Light 正文 + SemiBold 小标
4. 左对齐 + 大幅留白
5. Hairline 1px 是手术刀

## 单页特有规则（上游 slide 没有）

1. **Mermaid CDN 必须保留**，因为 ux-onepage 包含交互流程图
2. **打印友好**：所有 section `page-break-inside: avoid`
3. **STALE 提示**保留 `--warn-bg` 黄色块（不是 IKB），warn 不是 accent
4. **Iteration 标记**（`★NEW` / `(改造)` / `(已有)`）用 mono 小字渲染，新增项用 IKB 文字
5. 没有 `data-layout="Sxx"` 概念 —— 单页是 section 语义化，不是版式锁
