import Link from "next/link";
import type { Metadata } from "next";
import { GROUPS, getAllDocs, getDocsByGroup, type Group } from "@/lib/content";
import { DocSearch } from "@/components/DocSearch";

export const metadata: Metadata = { title: "Kiến thức" };

export default function DocsIndex() {
  const byGroup = getDocsByGroup();
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Kho kiến thức</h1>
        <p className="text-sm text-muted mt-1">Đọc theo thứ tự A → B/C → D. Ôn gấp thì đọc phần Q&amp;A cuối mỗi file trước.</p>
        <div className="mt-4"><DocSearch docs={getAllDocs()} /></div>
      </div>
      {(Object.keys(GROUPS) as Group[]).map((g) => (
        <section key={g} id={`group-${g}`} className="scroll-mt-20">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>{GROUPS[g].emoji}</span> {g} · {GROUPS[g].name}
          </h2>
          <p className="text-sm text-muted">{GROUPS[g].desc}</p>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {byGroup[g].map((d) => (
              <li key={d.slug}>
                <Link href={`/docs/${d.slug}`} className="flex gap-3 px-4 py-3 hover:bg-accent/5">
                  <span className="font-mono text-xs text-accent pt-1 w-7 shrink-0">{d.code}</span>
                  <span className="min-w-0">
                    <span className="block font-medium">{d.title}</span>
                    <span className="block text-sm text-muted line-clamp-2">{d.summary}</span>
                    <span className="block text-xs text-muted mt-1">~{Math.round(d.words / 200)} phút đọc</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
