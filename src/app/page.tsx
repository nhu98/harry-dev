import Link from "next/link";
import { GROUPS, getDocsByGroup, type Group } from "@/lib/content";

const STACK = ["TypeScript", "React", "Next.js", "React Native", "Redux", "Tailwind CSS", "React Query", "Firebase", "Stripe / IAP", "WebSocket", "Jest / RTL", "Vercel"];

const WORK = [
  {
    name: "Waxstat",
    role: "Mobile & Frontend · 2024–nay",
    desc: "Price tracker cho thẻ thể thao. Xây toàn bộ frontend từ đầu (RN + React), ship 2 app lên App Store / Google Play, subscription IAP + Stripe chống double-charge, push pipeline FCM + Notifee, chart engine memoized.",
  },
  {
    name: "HugeWin",
    role: "Core Frontend · Next.js",
    desc: "Nền tảng gaming crypto. Auth + 2FA, module KYC với form từ CMS, realtime WebSocket (balance, deposit, KYC status), search engine client-side không gọi API mỗi phím.",
  },
  {
    name: "SadlierConnect",
    role: "Frontend · 2021–2022",
    desc: "Refactor nền tảng giáo dục Java server-rendered thành React SPA với API layer riêng, team 15 người. Redux, styled-components, Ant Design.",
  },
];

const PERSONAL = [
  { name: "ecommerce-fe", url: "https://github.com/nhu98/ecommerce-fe", demo: "https://ecommerce-fe-woad.vercel.app", desc: "E-commerce frontend Next.js" },
  { name: "littleSunnyWeb", url: "https://github.com/nhu98/littleSunnyWeb", demo: "https://little-sunny-demo.vercel.app", desc: "Web + trang quản trị" },
  { name: "api-software", url: "https://github.com/nhu98/api-software", demo: "https://api-software.vercel.app", desc: "Landing đa ngôn ngữ, animation" },
  { name: "deep-link-demo", url: "https://github.com/nhu98/deep-link-demo", desc: "Demo deep link React Native" },
  { name: "30days-react", url: "https://github.com/nhu98/30days-react", desc: "Bài tập React 30 ngày" },
];

export default function Home() {
  const byGroup = getDocsByGroup();
  return (
    <div className="space-y-14">
      <section className="pt-6 sm:pt-12">
        <p className="text-sm text-muted">Quốc Như Huỳnh · Harry</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
          Frontend &amp; Mobile Developer.<br className="hidden sm:block" /> React · Next.js · React Native.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          5 năm TypeScript. Thích những bài toán client-side khó: realtime, offline, race condition, payment.
          Trang này vừa là portfolio, vừa là nơi tôi lưu kiến thức và bài học, đọc được trên điện thoại.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full border border-border bg-card">{s}</span>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/docs" className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium">Đọc kiến thức</Link>
          <a href="https://github.com/nhu98" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md border border-border text-sm">GitHub</a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Dự án đã làm</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {WORK.map((w) => (
            <article key={w.name} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold">{w.name}</h3>
              <p className="text-xs text-muted mt-0.5">{w.role}</p>
              <p className="text-sm mt-2 leading-relaxed">{w.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Kho kiến thức</h2>
        <p className="text-sm text-muted mt-1">Markdown tự tổng hợp, song ngữ VI/EN, build tĩnh từ repo.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(GROUPS) as Group[]).map((g) => (
            <Link key={g} href={`/docs#group-${g}`} className="rounded-lg border border-border bg-card p-4 hover:border-accent transition">
              <div className="text-2xl">{GROUPS[g].emoji}</div>
              <h3 className="font-semibold mt-2">{g} · {GROUPS[g].name}</h3>
              <p className="text-sm text-muted mt-1">{GROUPS[g].desc}</p>
              <p className="text-xs text-muted mt-3">{byGroup[g].length} tài liệu</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Dự án cá nhân trên GitHub</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PERSONAL.map((p) => (
            <li key={p.name} className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-3">
              <div>
                <a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:text-accent">{p.name}</a>
                <p className="text-sm text-muted">{p.desc}</p>
              </div>
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded border border-border whitespace-nowrap">Demo ↗</a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
