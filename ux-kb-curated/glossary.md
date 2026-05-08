# UX Glossary

Hand-curated term map for the design-partner skill. Keep < 100 lines.

The skill reads this file at the start of every session as **anchor knowledge** — it bridges FTS5's keyword-only retrieval (no semantic understanding) by mapping synonyms / cross-language terms / project-specific jargon to canonical concepts.

## How to use

- One row per concept.
- Canonical term first, then aliases / synonyms / Chinese equivalents.
- Add a one-line meaning if the term isn't self-explanatory.
- Edit freely. No script regenerates this — it's pure human curation.

## Terms

| Canonical | Aliases / Synonyms | Meaning |
|---|---|---|
| alternate routing | 备用路径, alt-route, alt routing | Fallback path between ZP and ZCC during disruption or planned changes. |
| auto receptionist | auto attendant, IVR, 自动接待员, 语音应答菜单 | Automated voice menu directing inbound calls. |
| call queue | call group, 呼叫队列, 排队 | Queued distribution of inbound calls to a group of users. |
| common area phone | shared phone, 公共区域电话, 共享话机 | Phone shared by multiple users without a dedicated owner. |
| extension | ext, 分机 | Internal number assigned to a user, room, or auto receptionist. |
| Push to Talk | PTT, 一键通, 对讲 | Walkie-talkie style channel within Zoom Workplace. |
| shared line group | SLG, 共享线路组, 共享线 | Group of phones that share the same external number. |
| BYOC | Bring Your Own Carrier, 自带运营商 | Customer-provided PSTN connectivity; BYOC-P = premise variant. |
| 10DLC | A2P 10-digit long code, A2P SMS | US carrier registration framework for application-to-person SMS. |
| voicemail | VM, 语音邮件, 语音留言 | Recorded message left for an unreachable user. |
| videomail | video voicemail, 视频留言 | Voicemail with video. |

## Add new terms when

- A discussion turns up a term that ctx_search misses on synonyms (e.g., user said "X", PRD said "Y", they're the same thing).
- A new feature/concept enters the product's vocabulary and needs anchoring.
- A term has both English and Chinese forms used by the team.

## Don't add

- General UX terms that aren't product-specific (the LLM has those).
- One-off project codenames (those go in the project's own state.md).
- Marketing taglines.
