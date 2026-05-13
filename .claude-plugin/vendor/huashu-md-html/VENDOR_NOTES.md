# Vendored: huashu-md-html (md→html slice)

This directory contains a **partial vendor** of [alchaincyf/huashu-md-html](https://github.com/alchaincyf/huashu-md-html), used by `/ux-project:onepage` to render `ux-onepage.html` from `ux-onepage.md` with publishing-grade typography.

## Scope

Only the **md → html** capability (`scripts/md_to_html.py` + 4 CSS themes). The other 3 capabilities (万物→md / html→md / md→docx) are NOT vendored — see upstream if you need them.

## Source

- Upstream repo: https://github.com/alchaincyf/huashu-md-html
- Upstream commit: `de20653a5e6f88f0e747fa6a0410e9c78b06e75e` (2026-05-11)
- Upstream version: corresponds to README "v3 Hara hero"
- License: MIT — see `LICENSE` in this directory

## What's vendored

```
scripts/md_to_html.py             # main converter, calls pandoc
templates/article/                # Tufte-inspired editorial
templates/reading/                # Medium-style minimal
templates/report/                 # Publishing whitepaper (ux-onepage DEFAULT)
templates/interactive/            # Long-form with TOC + sidebar
LICENSE                           # upstream MIT
```

NOT vendored (intentional):
- `scripts/any_to_md.py` / `html_to_md.py` / `md_to_docx.py` — other capabilities
- `templates/wechat/` — WeChat-specific styling, not relevant
- `references/*` — reference cookbooks, only useful in standalone skill
- `demos/`, `examples/`, `README.md` — marketing material

## Local modifications

None. Files are byte-identical to upstream at the captured commit.

## Runtime dependency

`pandoc` must be available in PATH. The script self-checks and exits with a friendly install hint if missing:

```bash
brew install pandoc         # macOS
apt install pandoc          # Debian/Ubuntu
choco install pandoc        # Windows
```

## How `/ux-project:onepage` uses it

1. Generate `ux-onepage.md` from project state (existing behavior, unchanged)
2. Check `which pandoc` — if missing, surface install hint, fall back to the inline `ux-onepage.html.template` rendering
3. If pandoc present, shell out:
   ```bash
   python3 .claude-plugin/vendor/huashu-md-html/scripts/md_to_html.py \
     ux-onepage.md \
     --theme report \
     --inline-images \
     -o ux-onepage.html
   ```
4. The output is a self-contained single HTML file with the report theme's typography.

## How to update this vendor

When upstream releases a new version worth pulling:

```bash
cd /tmp && rm -rf huashu-fresh && git clone https://github.com/alchaincyf/huashu-md-html.git huashu-fresh
cd huashu-fresh && git rev-parse HEAD   # record the commit
# Then in this repo:
cp huashu-fresh/scripts/md_to_html.py .claude-plugin/vendor/huashu-md-html/scripts/
cp -R huashu-fresh/templates/{article,reading,report,interactive} .claude-plugin/vendor/huashu-md-html/templates/
cp huashu-fresh/LICENSE .claude-plugin/vendor/huashu-md-html/
# Update the "Upstream commit" line above
```

Then test with a real `ux-onepage.md` before committing.
