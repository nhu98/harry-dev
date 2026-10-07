/**
 * Every piece of UI copy lives here. Components never hardcode text.
 * Change wording (or add a language) in one place.
 */
export const STRINGS = {
  common: {
    toc: "Mục lục",
    readMinutes: (n: number) => `~${n} phút đọc`,
    demo: "Demo ↗",
    prev: "← Trước",
    next: "Tiếp →",
    viewAll: "Xem cả nhóm",
    tapToFlip: "chạm để xem nghĩa",
    docsCount: (n: number) => `${n} tài liệu`,
  },
  nav: {
    home: "Trang chủ",
    docs: "Kiến thức",
    checklist: "Checklist",
    phrases: "Câu mẫu EN",
  },
  footer: {
    builtWith: "Next.js 16 · Tailwind v4 · Markdown → SSG · Vercel",
    github: "GitHub",
  },
  home: {
    headline: "Frontend & Mobile Developer.",
    subheadline: "React · Next.js · React Native.",
    intro: "5 năm TypeScript. Thích những bài toán client-side khó: realtime, offline, race condition, payment. Trang này vừa là portfolio, vừa là nơi tôi lưu kiến thức và bài học, đọc được trên điện thoại.",
    ctaDocs: "Đọc kiến thức",
    ctaGithub: "GitHub",
    work: "Dự án đã làm",
    knowledge: "Kho kiến thức",
    knowledgeDesc: "Markdown tự tổng hợp, song ngữ VI/EN, build tĩnh từ repo.",
    repos: "Dự án cá nhân trên GitHub",
  },
  docs: {
    title: "Kho kiến thức",
    description: "Đọc theo thứ tự A → B/C → D. Ôn gấp thì đọc phần Q&A cuối mỗi file trước.",
    searchPlaceholder: "Tìm tài liệu… (ví dụ: redux, websocket, tiếng anh)",
    breadcrumb: "Kiến thức",
  },
  checklist: {
    title: "Checklist hôm nay",
    description: "Theo thời gian biểu E5. Ngày lười chỉ cần làm các dòng 🔴. Lưu trên máy này (localStorage), không cần đăng nhập.",
    minimum: "🔴 tối thiểu",
    streak: "Chuỗi ngày đạt",
    rule: "Luật: ngày lười làm dòng 🔴 vẫn tính đạt. Không bỏ 2 ngày liên tiếp.",
  },
  phrases: {
    title: "Câu mẫu tiếng Anh đi làm",
    description: "Câu ngắn, mức A2. Chạm thẻ để lật. Đọc to 5 lần mỗi câu.",
    sideEn: "🇬🇧 English",
    sideVi: "🇻🇳 Nghĩa",
    shuffle: "🔀",
  },
} as const;
