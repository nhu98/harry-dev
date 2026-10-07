---
paths:
  - "src/**/*.tsx"
---
# UI

## Không inline (luật cứng)
- Class dài (> 6 token) hoặc dùng ở ≥ 2 chỗ → `shared/ui/styles.ts` hoặc component mới trong `shared/ui`. Chỉ class bố cục nhỏ (`mt-2`, `flex-1`, `hidden lg:block`) được inline.
- Chữ hiển thị → `config/strings.ts` (`STRINGS.<page>.<key>`). Không viết tiếng Việt/Anh trực tiếp trong JSX.
- Route → `SITE.routes.*` trong `config/site.ts`.
- Số ma thuật → hằng số có tên đầu file.
- Sau khi sửa tsx: chạy `pnpm check:inline`; phải "ok".

- Dùng `Button`, `ButtonLink`, `Card`, `Badge`, `PageHeader`, `Section` từ `@/shared/ui` thay vì viết lại class.
- Màu qua token: `bg-card`, `border-border`, `text-muted`, `text-accent`, `bg-background`. Không hardcode hex trong component.
- Mobile-first: thử ở 375px trước. Bảng/code rộng phải cuộn ngang trong container, body không cuộn ngang.
- Client component (`"use client"`) chỉ khi cần state/effect/localStorage. State từ localStorage đọc qua `useSyncExternalStore` (xem `shared/lib/storage.ts`), không `setState` trong `useEffect`.
- Nối class bằng `cn()` từ `@/shared/lib/cn`.
