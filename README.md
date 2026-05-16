# Mutezeze OS

> 사진첩에 묻힌 인사이트, 카드뉴스로 자라난다.

A personal insight system: capture references via Telegram → Claude classifies/tags/summarizes → Supabase → live on this site.

- **Live**: https://mutezeze.vercel.app
- **Portfolio entry**: [zezechoi.github.io](https://zezechoi.github.io/#work) → SI003

## Stack

| Layer | Tool |
|---|---|
| Inbound | Telegram bot + Claude Code (channel mode) |
| Storage | Supabase (Postgres + RLS + REST) |
| Output | Static HTML + Tailwind CDN + Pretendard, built with a tiny `node` script, hosted on Vercel |

## Local build

Requires Node 18+.

```bash
SUPABASE_URL="https://...supabase.co" SUPABASE_ANON_KEY="eyJ..." npm run build
# → dist/
```

## Environment variables

Set in Vercel Project Settings → Environment Variables:

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — anon (public) key, safe to expose to clients

The build script (`build.mjs`) replaces `__SUPABASE_URL__` / `__SUPABASE_ANON_KEY__` placeholders in HTML at build time. Without them, pages still load but show empty states.

## Pages

- `/` — dashboard
- `/today/` — today's input
- `/insights/` — searchable insights library
- `/diary/` — content references (Instagram / YouTube / blogs / links)
- `/about/` — how it works
- `/index/` — categories + top tags

---

Built by [zezechoi](https://zezechoi.github.io) × Claude · 2026 · Edition 01
