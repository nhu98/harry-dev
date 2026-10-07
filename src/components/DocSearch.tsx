"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DocMeta } from "@/lib/content";

export function DocSearch({ docs }: { docs: DocMeta[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return docs.filter((d) => `${d.code} ${d.title} ${d.summary}`.toLowerCase().includes(s)).slice(0, 8);
  }, [q, docs]);
  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm tài liệu… (ví dụ: redux, websocket, tiếng anh)"
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-hidden">
          {results.map((d) => (
            <li key={d.slug}>
              <Link href={`/docs/${d.slug}`} className="block px-3 py-2 text-sm hover:bg-accent/10" onClick={() => setQ("")}>
                <span className="font-mono text-xs text-accent mr-2">{d.code}</span>{d.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
