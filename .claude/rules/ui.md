---
paths:
  - "src/**/*.tsx"
---
# UI

- Dùng `Button`, `ButtonLink`, `Card`, `Badge`, `PageHeader`, `Section` từ `@/shared/ui` thay vì viết lại class.
- Màu qua token: `bg-card`, `border-border`, `text-muted`, `text-accent`, `bg-background`. Không hardcode hex trong component.
- Mobile-first: thử ở 375px trước. Bảng/code rộng phải cuộn ngang trong container, body không cuộn ngang.
- Client component (`"use client"`) chỉ khi cần state/effect/localStorage. State từ localStorage đọc qua `useSyncExternalStore` (xem `shared/lib/storage.ts`), không `setState` trong `useEffect`.
- Nối class bằng `cn()` từ `@/shared/lib/cn`.
