# Kiến trúc source code

Mô hình: **feature-first + shared layer**. Mỗi tính năng là một thư mục khép kín. Những gì dùng chung từ 2 feature trở lên mới đưa vào `shared/`. Route (`app/`) chỉ ghép component, không chứa logic.

```
src/
├── app/                      # Routes của Next.js. MỎNG: chỉ import và ghép. Không logic, không data.
│   ├── layout.tsx
│   ├── page.tsx              # /            → features/portfolio
│   ├── docs/                 # /docs, /docs/[slug] → features/docs
│   ├── checklist/            # /checklist   → features/checklist
│   └── phrases/              # /phrases     → features/phrases
│
├── config/
│   ├── site.ts               # Hằng số toàn site: tên, route table, link GitHub, năm.
│   └── strings.ts            # TOÀN BỘ chữ hiển thị. Component không hardcode text.
│
├── shared/                   # Dùng chung, KHÔNG biết gì về feature nào
│   ├── ui/
│   │   ├── styles.ts         # Bộ class dùng chung (layout, text, surface, control, grid...). Không copy class dài inline.
│   │   ├── Button, ButtonLink, Card, Badge, Input, List/ListRow, TextLink, Stat, H1/H2/H3/Muted, PageHeader, Section, Header, Footer
│   │   └── index.ts          # Export tất cả. Feature chỉ import từ "@/shared/ui".
│   └── lib/                  # cn (class names), storage (localStorage + external store), date
│
└── features/                 # Mỗi feature tự chứa data + logic + component của nó
    ├── docs/
    │   ├── types.ts          # DocMeta, Doc, Heading, Group
    │   ├── groups.ts         # Định nghĩa nhóm A/B/C/D/E
    │   ├── lib/
    │   │   ├── repository.ts # CHỖ DUY NHẤT đọc file system. Thay bằng CMS → chỉ sửa file này.
    │   │   ├── markdown.ts   # Markdown → HTML, trích heading. Hàm thuần: string vào, string ra.
    │   │   └── links.ts      # Đổi link .md → /docs/slug, chặn lộ tên file riêng tư.
    │   ├── service.ts        # API công khai của feature. Page CHỈ import từ đây.
    │   └── components/       # DocSearch, DocList, DocToc, DocPager, DocArticle
    ├── checklist/
    │   ├── tasks.ts          # Data (từ E5)
    │   ├── useChecklist.ts   # Logic: state, streak, toggle (hook)
    │   └── components/       # DailyChecklist (chỉ render)
    ├── phrases/
    │   ├── phrases.ts        # Data
    │   ├── useDeck.ts        # Logic lật thẻ / shuffle (hook, tái dùng cho deck khác)
    │   └── components/       # Flashcards
    └── portfolio/
        ├── profile.ts        # Data: stack, dự án, repo. Sửa portfolio = sửa file này.
        └── components/       # Hero, WorkGrid, GroupGrid, RepoList
```

## Nguyên tắc (SOLID ở mức vừa đủ cho web tĩnh)

| Nguyên tắc | Áp dụng ở đâu |
|---|---|
| **Single responsibility** | `repository.ts` chỉ đọc file. `markdown.ts` chỉ render. `links.ts` chỉ đổi link. Component chỉ render, logic nằm trong hook. |
| **Open/closed** | Thêm nhóm tài liệu: thêm 1 dòng vào `groups.ts`. Thêm nhóm câu mẫu: thêm vào `phrases.ts`. Không sửa component. |
| **Dependency inversion** | Page phụ thuộc vào `service.ts` (API của feature), không phụ thuộc vào `fs`. Component nhận data qua props. |
| **Data tách khỏi UI** | Mọi nội dung nằm trong file `.ts` thuần (`profile.ts`, `tasks.ts`, `phrases.ts`), không có JSX. |
| **Shared chỉ khi dùng chung** | Một thứ dùng ở 1 feature thì để trong feature đó. Dùng ở 2 nơi mới chuyển sang `shared/`. |

## Luật "không inline" (để sửa hàng loạt được)

| Thứ | Không được | Phải để ở |
|---|---|---|
| Chuỗi class > 6 token hoặc dùng ≥ 2 nơi | `className="rounded-lg border ... p-4"` trong feature | `shared/ui/styles.ts` hoặc thành component trong `shared/ui` |
| Chữ hiển thị (label, placeholder, tiêu đề, mô tả) | `<p>Mục lục</p>` | `config/strings.ts` |
| Đường dẫn route | `` `/docs/${slug}` `` rải rác | `config/site.ts` → `routes` |
| Màu, kích thước | `#2563eb`, `max-w-6xl` lặp lại | token trong `globals.css` + `styles.layout` |
| Số "ma thuật" | `slice(0, 8)` | hằng số có tên ở đầu file (`MAX_RESULTS`) |
| Logic | trong JSX | hook `useX.ts` hoặc `service.ts` |

Class ngắn mang tính bố cục cục bộ (`mt-2`, `flex-1`, `hidden lg:block`) được phép inline. Kiểm tra tự động: `pnpm check:inline` (gọi trong `pnpm check` và skill `/verify`).

## Luật import (giữ dependency một chiều)

```
app  →  features  →  shared  →  (không import gì của dự án)
         ↓
       config
```
- `shared/` không bao giờ import từ `features/` hay `app/`.
- Feature không import từ feature khác, trừ qua `service.ts` của feature đó (ví dụ portfolio dùng `docs/service`).
- `app/` không import từ `features/*/lib`. Chỉ dùng `service.ts` và `components/`.

## Thêm một feature mới (ví dụ: "notes")

1. Tạo `src/features/notes/` với `types.ts`, data hoặc `repository`, `service.ts`, `components/`.
2. Tạo route `src/app/notes/page.tsx` chỉ import từ `features/notes/service` và `components`.
3. Thêm link vào `config/site.ts` → `nav`.
4. Cần UI mới dùng chung? Thêm vào `shared/ui/` và export trong `index.ts`.

## Nội dung markdown

`content/` được sinh bởi `scripts/sync-content.mjs` từ thư mục cha theo **allowlist** và có **redact tên người**. Không sửa tay trong `content/`; sửa file gốc rồi chạy `pnpm sync`.

## Trợ lý AI (features/assistant)

- Hai chế độ: `ask` (hỏi đáp, tự tìm trong toàn bộ kho bằng `features/docs/lib/search.ts` hoặc kèm 1 file) và `english` (gia sư A2). Không có tạo ảnh.
- Server: `app/api/assistant/route.ts` (mỏng: kiểm tra same-origin + rate limit) → `service.ts` (ngữ cảnh + thử lần lượt các model) → `lib/gemini.ts` (một lần fetch).
- Client: `useAssistant.ts` giữ nhiều cuộc hội thoại trong localStorage (`harry-assistant-v2`). Hàm thuần xử lý parse/dọn dẹp nằm ở `lib/threads.ts`. Giới hạn trong `SITE.assistant`: tối đa 50 cuộc, 90 ngày, 60 tin/cuộc, tổng dưới 3MB. Vượt thì tự xoá cuộc cũ nhất khi ghi.
- UI: `AssistantChat` có 2 tab (Trò chuyện / Lịch sử), dùng chung cho bong bóng (mọi trang) và trang `/assistant`.
- Kiểm thử: `pnpm test:assistant [url]` chạy luồng lịch sử với API giả (không tốn hạn mức); `pnpm shot:desktop [url]` và `pnpm shot:mobile [url]` chụp ảnh + đo lệch.
