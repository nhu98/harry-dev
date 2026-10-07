# harry.dev — portfolio + knowledge base (Next.js 16, Tailwind v4)

Kiến trúc chi tiết: `ARCHITECTURE.md` (đọc trước khi thêm/sửa code). Nội dung markdown: `content/` sinh từ thư mục cha bằng `scripts/sync-content.mjs`.

## Lệnh
```bash
pnpm dev          # http://localhost:3000
pnpm sync         # copy allowlist ../*.md → content/ (redact tên người)
pnpm lint && pnpm exec tsc --noEmit && pnpm build   # phải sạch trước khi commit
```

## Luật cứng
- `app/` chỉ ghép component. Logic và data nằm trong `features/<tên>/`. UI dùng chung ở `shared/ui`.
- Import một chiều: app → features → shared. `shared/` không import `features/`. Feature khác chỉ dùng qua `service.ts`.
- Nội dung riêng tư (tên sếp/PO/PM, lương, CV) không được vào repo này. Chỉ thêm file vào web bằng cách sửa allowlist trong `scripts/sync-content.mjs`.
- Next 16 bật `cacheComponents`: không gọi `new Date()`/`Math.random()` trong server component hay lúc render; đưa vào client hook hoặc hằng số. Không dùng `dynamicParams`.
- Đơn giản trước: không thêm thư viện khi 20 dòng code tự viết là đủ.

## Skills (gõ `/tên`)
`/add-feature`, `/verify`, `/sync-content`, `/add-phrases`, `/upgrade-check`. Xem `.claude/skills/`.
