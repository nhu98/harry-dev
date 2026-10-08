/** Single place for site-wide constants. Change here, applied everywhere. */
export const SITE = {
  name: "Harry.dev",
  owner: "Harry Huynh",
  fullName: "Quốc Như Huỳnh · Harry",
  title: "Harry Huynh — Frontend & Mobile",
  description: "Kho kiến thức Frontend / React Native / tiếng Anh cho dev, và portfolio của Harry Huynh.",
  github: "https://github.com/nhu98",
  year: 2026,
  /** Route table. Labels come from STRINGS.nav so copy stays in one place. */
  nav: [
    { href: "/", key: "home" },
    { href: "/today", key: "today" },
    { href: "/docs", key: "docs" },
    { href: "/checklist", key: "checklist" },
    { href: "/phrases", key: "phrases" },
    { href: "/assistant", key: "assistant" },
  ],
  illustrations: { today: "/illustrations/today.svg", checklist: "/illustrations/checklist.svg", phrases: "/illustrations/phrases.svg", assistant: "/illustrations/assistant.svg", docs: "/illustrations/docs.svg" },
  /** Assistant history retention: oldest threads are dropped beyond these limits. */
  assistant: { maxThreads: 50, maxAgeDays: 90, maxMessages: 60 },
  routes: { assistantApi: "/api/assistant", docs: (slug: string) => `/docs/${slug}`, docsGroup: (g: string) => `/docs#group-${g}` },
} as const;
