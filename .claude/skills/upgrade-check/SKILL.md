---
name: upgrade-check
description: Trước khi nâng cấp Next.js / React / Tailwind, tra web changelog và breaking changes rồi đề xuất kế hoạch. Dùng khi nói "nâng cấp", "update deps", "Next mới có gì".
argument-hint: [tên package]
allowed-tools: WebSearch WebFetch Bash(pnpm outdated*) Bash(cat package.json) Read
---
Package: $ARGUMENTS

## Phiên bản hiện tại
!`pnpm outdated 2>/dev/null | head -20 || true`

1. Tra docs chính thức (nextjs.org/docs/app/guides/upgrading, react.dev/blog, tailwindcss.com/docs/upgrade-guide) cho phiên bản mới.
2. Liệt kê breaking changes ảnh hưởng repo này: cacheComponents, `params` Promise, Tailwind v4 `@theme`, ESLint config.
3. Đề xuất: nâng hay chưa, lý do 1 câu, lệnh cụ thể, và bước `/verify` sau nâng.
4. Không tự chạy `pnpm add`/`pnpm up` khi chưa được đồng ý.
