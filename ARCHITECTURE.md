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
│   └── site.ts               # Hằng số toàn site: tên, nav, link GitHub, năm. Đổi 1 chỗ, áp dụng mọi nơi.
│
├── shared/                   # Dùng chung, KHÔNG biết gì về feature nào
│   ├── ui/                   # Button, Card, Badge, PageHeader, Section, Header, Footer (+ index.ts)
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
