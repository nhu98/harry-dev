/** Portfolio data. Edit this file to update the home page; no JSX here. */
export const STACK = ["TypeScript", "React", "Next.js", "React Native", "Redux", "Tailwind CSS", "React Query", "Firebase", "Stripe / IAP", "WebSocket", "Jest / RTL", "Vercel"];

export type WorkItem = { name: string; role: string; desc: string };
export const WORK: WorkItem[] = [
  { name: "Waxstat", role: "Mobile & Frontend · 2024–nay", desc: "Price tracker cho thẻ thể thao. Xây toàn bộ frontend từ đầu (RN + React), ship 2 app lên App Store / Google Play, subscription IAP + Stripe chống double-charge, push pipeline FCM + Notifee, chart engine memoized." },
  { name: "HugeWin", role: "Core Frontend · Next.js", desc: "Nền tảng gaming crypto. Auth + 2FA, module KYC với form từ CMS, realtime WebSocket (balance, deposit, KYC status), search engine client-side không gọi API mỗi phím." },
  { name: "SadlierConnect", role: "Frontend · 2021–2022", desc: "Refactor nền tảng giáo dục Java server-rendered thành React SPA với API layer riêng, team 15 người. Redux, styled-components, Ant Design." },
];

export type Repo = { name: string; url: string; demo?: string; desc: string };
export const REPOS: Repo[] = [
  { name: "ecommerce-fe", url: "https://github.com/nhu98/ecommerce-fe", demo: "https://ecommerce-fe-woad.vercel.app", desc: "E-commerce frontend Next.js" },
  { name: "littleSunnyWeb", url: "https://github.com/nhu98/littleSunnyWeb", demo: "https://little-sunny-demo.vercel.app", desc: "Web + trang quản trị" },
  { name: "api-software", url: "https://github.com/nhu98/api-software", demo: "https://api-software.vercel.app", desc: "Landing đa ngôn ngữ, animation" },
  { name: "deep-link-demo", url: "https://github.com/nhu98/deep-link-demo", desc: "Demo deep link React Native" },
  { name: "30days-react", url: "https://github.com/nhu98/30days-react", desc: "Bài tập React 30 ngày" },
];
