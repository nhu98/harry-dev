---
name: sync-content
description: Đồng bộ markdown từ thư mục cha vào content/ và kiểm tra rò rỉ tên riêng tư. Dùng khi kho tài liệu vừa sửa, hoặc muốn thêm/bớt file công khai.
argument-hint: [tên file muốn thêm vào allowlist, tuỳ chọn]
allowed-tools: Bash(pnpm sync*) Bash(node scripts/*) Bash(grep *) Read Edit
---
Yêu cầu: $ARGUMENTS

1. Nếu có tên file cần thêm: kiểm tra nó thuộc nhóm được phép (A/B/C/D1/D3/E2/E4–E7). Nếu là E8/E9/E10/D2/D4/CV → từ chối, giải thích 1 câu.
2. Sửa `ALLOW` trong `scripts/sync-content.mjs` nếu cần.
3. `pnpm sync`.
4. `grep -rlE "Allan|Oleg|Tôn Nguyễn|IMT Solutions" content/` phải trống. Nếu không, thêm pattern vào `REDACT` và chạy lại.
5. Liệt kê file thay đổi (`git status --short content/`).
