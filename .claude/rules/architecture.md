# Kiến trúc (feature-first + shared)

- Thêm feature: `features/<tên>/{types.ts, <data>.ts | lib/repository.ts, service.ts, components/}` + route mỏng trong `app/`. Theo `ARCHITECTURE.md` mục "Thêm một feature mới".
- Data không có JSX (`profile.ts`, `tasks.ts`, `phrases.ts`). Logic trong hook (`useX.ts`) hoặc `service.ts`. Component chỉ render.
- Một thứ dùng ở 1 feature thì để trong feature đó. Dùng ở 2 nơi mới chuyển sang `shared/`.
- Hằng số toàn site chỉ ở `config/site.ts`.
