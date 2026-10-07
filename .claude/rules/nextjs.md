---
paths:
  - "src/app/**"
  - "next.config.ts"
---
# Next.js 16 (App Router, cacheComponents)

- `params` là Promise: `const { slug } = await params`.
- Trang tĩnh: `generateStaticParams` + `notFound()` cho slug lạ. Không dùng `dynamicParams` (xung đột cacheComponents).
- Không `new Date()`, `Math.random()`, `headers()`, `cookies()` trong server component trừ khi có `"use cache"` hoặc `connection()`.
- Metadata qua `export const metadata` hoặc `generateMetadata`. Title dùng template trong `layout.tsx`.
