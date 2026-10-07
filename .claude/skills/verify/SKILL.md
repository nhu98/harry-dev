---
name: verify
description: Kiểm tra toàn bộ trước khi commit — lint, typecheck, build, và curl các trang chính, kiểm tra rò rỉ tên riêng tư. Dùng khi nói "kiểm tra lại", "test lại", trước mỗi commit.
allowed-tools: Bash(pnpm *) Bash(curl *) Bash(grep *) Bash(pkill *)
---
Chạy lần lượt, dừng ở bước đầu tiên lỗi và sửa:

```!
pnpm lint 2>&1 | tail -5
pnpm exec tsc --noEmit 2>&1 | head -10
pnpm check:inline 2>&1 | tail -5
pnpm build 2>&1 | grep -E "✓ Generating|Error|error" | head -5
grep -rlE "Allan|Oleg|Tôn Nguyễn|IMT Solutions" content/ src/ || echo "privacy: ok"
```

Rồi smoke test: `pnpm start -p 3999 &`, chờ 4 giây, curl `/`, `/docs`, `/checklist`, `/phrases`, một trang `/docs/<slug>`, và `/docs/khong-ton-tai` phải 404. Sau đó `pkill -f "next start"`.

Báo kết quả dạng bảng: bước / trạng thái. Không nói "ổn" nếu có bước chưa chạy.
