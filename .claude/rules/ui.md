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
- Mobile-first: thử ở 390px trước bằng `pnpm shot:mobile <url>` rồi Read ảnh trong `shots/`. Trên mobile: **không dùng cuộn ngang cho menu/nút** (dùng `flex-wrap`); chỉ code block được cuộn ngang. Bảng markdown trên mobile tự xếp thành card nhờ `rehype-table-labels` + CSS `.doc table` trong `globals.css`, không sửa thành cuộn ngang. Body không cuộn ngang.
- Khi user báo lỗi hiển thị: chụp bằng `pnpm shot:mobile <url>` và **Read ảnh** trước khi sửa. Script chỉ bắt phần tử tràn, không bắt nội dung bị cắt trong container cuộn ngang.
- Client component (`"use client"`) chỉ khi cần state/effect/localStorage. State từ localStorage đọc qua `useSyncExternalStore` (xem `shared/lib/storage.ts`), không `setState` trong `useEffect`.
- Nối class bằng `cn()` từ `@/shared/lib/cn`.

## Thư viện nặng (Three.js, chart…)
- Chỉ `import()` động bên trong `useEffect` của client component, không import tĩnh ở đầu file. Mẫu: `features/portfolio/components/Hero3D.tsx`.
- Luôn: cleanup (dispose geometry/material/renderer, cancelAnimationFrame, remove listeners) và tôn trọng `prefers-reduced-motion`.
- Không chặn nội dung: canvas là nền (`pointer-events-none`), chữ nằm trên.
- Ô nhập (input/textarea/select) trên mobile phải ≥ 16px, nếu không iOS Safari tự zoom khi focus. Đã đặt mặc định trong `globals.css`; không ghi đè bằng `text-sm` cho field.
- Trang nội dung hẹp (Hôm nay, Checklist, Câu mẫu, Trợ lý) bọc bằng `styles.layout.narrow` (max-w-2xl mx-auto) để nằm giữa; trang rộng (Kiến thức) dùng cả container. Không đặt cột hẹp lệch trái.
