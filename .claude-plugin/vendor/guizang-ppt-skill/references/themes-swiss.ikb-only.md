# IKB (International Klein Blue) · Token 参考

> 距离 guizang-ppt-skill `references/themes-swiss.md` 的 IKB 子集，按本插件单页场景重写。
> 上游许可：MIT (op7418)。

## 何时用 IKB

通用商业发布、产品策略、设计文档、JTBD 单页。最经典的瑞士风，绝不出错。

## Token 一览

```css
:root {
  /* 纸面 + 墨色：保留上游 IKB 主题的核心三色 */
  --paper:       #fafaf8;
  --paper-rgb:   250,250,248;
  --ink:         #0a0a0a;
  --ink-rgb:     10,10,10;

  /* 灰阶三档（跨主题统一） */
  --grey-1:      #f0f0ee;   /* 弱底色 / 区块分隔 */
  --grey-2:      #d4d4d2;   /* hairline + 关闭线 */
  --grey-3:      #737373;   /* 次级文字 */

  /* IKB 单一锚点色 */
  --accent:      #002FA7;
  --accent-rgb:  0,47,167;
  --accent-on:   #ffffff;   /* IKB 上的反白字 */
}
```

## 使用要点（单页适配版）

- IKB 是高饱和深蓝。整页只允许 **1–2 个 IKB 实色块** 做视觉焦点（hero / KEEP cell）
- 其余地方用 IKB 文字或 hairline 即可，IKB 一旦泛滥就掉档
- KPI 数字 / KEEP 决策 / hero kicker 用 `color: var(--accent)`
- 不要做 IKB 渐变；只用纯色

## 字重纪律

| 角色 | font-weight |
|---|---|
| Hero 巨字标题 | 200 ExtraLight |
| h2 / 区块标题 | 300 Light |
| 正文 | 300 Light |
| kicker / 标签 / KEEP | 600 SemiBold |
| mono 数字 | 400 Regular |

> 严禁用 800/900 重磅，那是 PowerPoint 不是瑞士。

## 不要做的事

- ❌ 多色高亮（橙黄绿同屏）—— Swiss = 单锚点
- ❌ 圆角 border-radius —— Swiss = 直角
- ❌ 阴影 / 渐变 / 模糊 —— Swiss = 纯色直边
- ❌ 衬线字体（Playfair / Noto Serif） —— Swiss = 无衬线
- ❌ 大段 IKB 满屏 —— IKB 是手术刀不是地毯
