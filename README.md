# harry.dev — portfolio + knowledge base

Next.js 16 (App Router) · Tailwind v4 · Markdown → static HTML · Vercel.

- `content/` — public subset of my knowledge base (copied by `pnpm sync` from the parent folder, with names redacted). Private plans, CV, and work notes are **not** in this repo.
- `/docs` — grouped docs with search and table of contents.
- `/checklist` — daily routine checklist (localStorage).
- `/phrases` — English flashcards for work.

```bash
pnpm sync    # copy allowlisted ../*.md → content/
pnpm dev
pnpm build
```
