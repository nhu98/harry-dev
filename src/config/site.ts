/** Single place for site-wide constants. Change here, applied everywhere. */
export const SITE = {
  name: "Harry.dev",
  owner: "Harry Huynh",
  fullName: "Quốc Như Huỳnh · Harry",
  title: "Harry Huynh — Frontend & Mobile",
  description: "Kho kiến thức Frontend / React Native / tiếng Anh cho dev, và portfolio của Harry Huynh.",
  github: "https://github.com/nhu98",
  year: 2026,
  nav: [
    { href: "/", label: "Trang chủ" },
    { href: "/docs", label: "Kiến thức" },
    { href: "/checklist", label: "Checklist" },
    { href: "/phrases", label: "Câu mẫu EN" },
  ],
} as const;
