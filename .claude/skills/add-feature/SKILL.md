---
name: add-feature
description: Scaffold một feature mới theo kiến trúc feature-first (types, data/service, components, route mỏng, nav). Dùng khi muốn thêm trang/tính năng mới cho web.
argument-hint: [tên-feature] [mô tả ngắn]
---
Feature: $ARGUMENTS

Đọc `ARCHITECTURE.md` mục "Thêm một feature mới". Rồi tạo đúng thứ tự:
1. `src/features/<tên>/types.ts`
2. Data thuần (`<tên>.ts`) hoặc `lib/repository.ts` nếu đọc file/API. Logic vào `use<Tên>.ts` (client) hoặc `service.ts` (server).
3. `components/<Tên>.tsx` chỉ render, dùng `@/shared/ui`.
4. `src/app/<tên>/page.tsx` mỏng: `PageHeader` + component. Có `export const metadata`.
5. Thêm vào `nav` trong `src/config/site.ts`.
6. Chạy `/verify`. Chỉ báo xong khi lint, tsc, build sạch.

Không thêm thư viện mới nếu chưa hỏi.
