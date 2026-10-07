import Link from "next/link";
import type { DocMeta } from "../types";

export function DocList({ docs }: { docs: DocMeta[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {docs.map((d) => (
        <li key={d.slug}>
          <Link href={`/docs/${d.slug}`} className="flex gap-3 px-4 py-3 hover:bg-accent/5">
            <span className="font-mono text-xs text-accent pt-1 w-7 shrink-0">{d.code}</span>
            <span className="min-w-0">
              <span className="block font-medium">{d.title}</span>
              <span className="block text-sm text-muted line-clamp-2">{d.summary}</span>
              <span className="block text-xs text-muted mt-1">~{d.readMinutes} phút đọc</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
