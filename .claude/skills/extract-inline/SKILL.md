---
name: extract-inline
description: Tìm class/chữ/route viết inline trong src/app và src/features rồi chuyển vào shared/ui/styles.ts, config/strings.ts, config/site.ts. Dùng khi check:inline báo lỗi hoặc sau khi thêm component mới.
allowed-tools: Bash(pnpm check:inline*) Bash(node scripts/*) Read Edit Grep
---
## Kết quả kiểm tra hiện tại
!`node scripts/check-inline.mjs || true`

Với mỗi dòng báo:
- `long className` → thêm key có nghĩa vào nhóm phù hợp trong `src/shared/ui/styles.ts` (layout/text/surface/control/grid/state) rồi thay bằng `styles.<nhóm>.<key>`. Nếu cả cụm JSX lặp ở 2 nơi, tạo component trong `shared/ui` và export ở `index.ts`.
- `hardcoded text` → thêm vào `src/config/strings.ts` đúng trang (`common` nếu dùng chung) rồi thay bằng `STRINGS.<page>.<key>`.
- Route chuỗi → `SITE.routes`.

Sau khi sửa: `pnpm check:inline` phải "ok", rồi `pnpm lint`. Không đổi giao diện, chỉ dời code.
