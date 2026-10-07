---
paths:
  - "content/**"
  - "scripts/**"
---
# Nội dung markdown

- Không sửa tay file trong `content/`. Sửa file gốc ở thư mục cha rồi chạy `pnpm sync`.
- Thêm file mới lên web: thêm tên vào `ALLOW` trong `scripts/sync-content.mjs`. Chỉ nhóm A/B/C/D1/D3/E2/E4–E7 được phép. Tuyệt đối không E8/E9/E10/D2/D4.
- Sau sync: `grep -lE "Allan|Oleg|Tôn Nguyễn|IMT" content/` phải không ra gì.
- Link giữa file dạng `[text](X.md#frag)`; `features/docs/lib/links.ts` sẽ đổi sang `/docs/slug`.
