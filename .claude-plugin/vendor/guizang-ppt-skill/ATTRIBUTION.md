---
upstream: https://github.com/op7418/guizang-ppt-skill
upstream_commit: main @ 2026-05-14
license: MIT
vendored_at: 2026-05-14
---

# Attribution — guizang-ppt-skill (Swiss 风格设计语言)

ux-partner 的 `ux-onepage.html` 模板视觉系统借鉴自 op7418（歸藏）的 `guizang-ppt-skill`，
特别是「风格 B · 瑞士国际主义」中的 IKB 克莱因蓝 token 与排版纪律。

## 我们 vendor 了什么

- `LICENSE` —— 原仓库 MIT 许可证全文，按 MIT 条款必须保留
- `references/themes-swiss.ikb-only.md` —— 摘录的 IKB token 设计参考（仅克莱因蓝单主题）
- `references/design-language-onepage.md` —— ux-partner 单页场景下的适配说明

## 我们 **没有** vendor 什么（与本插件场景不符）

- `assets/template-swiss.html` —— 16:9 多 slide deck 模板。ux-partner 输出单页滚动文档，不是 deck。
- `scripts/validate-swiss-deck.mjs` —— Swiss deck 静态校验（检查 `data-layout="Sxx"` 等）。
  单页模式没有 slide 概念，不适用。
- `references/swiss-layout-lock.md` / `layouts-swiss.md` —— S01–S22 slide 版式锁。同上。
- `references/swiss-map-component.md` —— MapLibre 地图组件（S08 扩展槽）。本插件不输出地图页。
- `assets/template.html`、`references/themes.md`、`references/layouts.md` —— 「风格 A · 电子杂志风」资产。
  本插件锁定 Swiss IKB，不暴露其他风格。
- `assets/motion.min.js` —— Motion One 动效。单页静态文档不需要入场动画。

## 适配差异（与上游差别）

上游 `template-swiss.html` 是 100vw × 100vh 的 slide 容器，靠 `vw/vh` 做"视口字号"。
ux-partner 单页是滚动文档，用 `clamp(min, preferred, max)` 替代纯 `vw`，避免大屏上字号失控。

| 维度 | 上游 (slide) | 本插件 (单页) |
|---|---|---|
| 容器 | `100vw × 100vh` 满屏 | `max-width: 1180px` 居中 |
| Hero 字号 | `11vw` ExtraLight | `clamp(40px, 6.4vw, 88px)` ExtraLight |
| 网格 | 16 列 Carbon 改造 | 12 列 + 偶尔跨列 |
| 动效 | Motion One 入场 | 无 |
| 主题切换 | 4 套（IKB/黄/绿/橙） | 锁死 IKB 克莱因蓝 |
| 版式锁 | S01–S22 必填 `data-layout` | section 语义化，无版式锁 |

保留的纪律（不变）：
- 单一锚点色（IKB only，不混高亮）
- ExtraLight 200 巨字 + Light 300 正文 + SemiBold 600 小标的字重对比
- 直角、无圆角、无阴影、无渐变
- Hairline 1px 分隔线
- mono kicker（uppercase + 大字间距）
- 左对齐 + 大幅留白做非对称美学

## 升级与维护

如果 op7418 上游更新了 IKB token 或排版纪律，请按以下步骤同步：
1. 重新读 `references/themes-swiss.md` 中的 IKB section
2. 比较 `--accent`、`--paper`、`--ink`、灰阶值是否变化
3. 若变化，更新 `.claude-plugin/templates/ux-onepage.html.template` 的 `:root` 块

不要 vendor slide 相关资产（template-swiss.html / validate-swiss-deck.mjs）—— 与单页架构不兼容。
