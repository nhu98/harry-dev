"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { Input, styles } from "@/shared/ui";
import type { DocMeta } from "../types";

const MAX_RESULTS = 8;

export function DocSearch({ docs }: { docs: DocMeta[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return docs.filter((d) => `${d.code} ${d.title} ${d.summary}`.toLowerCase().includes(s)).slice(0, MAX_RESULTS);
  }, [q, docs]);
  return (
    <div className="relative">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={STRINGS.docs.searchPlaceholder} />
      {results.length > 0 && (
        <ul className={styles.surface.dropdown}>
          {results.map((d) => (
            <li key={d.slug}>
              <Link href={SITE.routes.docs(d.slug)} className={styles.surface.dropdownRow} onClick={() => setQ("")}>
                <span className={`${styles.text.code} mr-2`}>{d.code}</span>{d.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
