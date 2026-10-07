import Link from "next/link";
import type { DocMeta } from "../types";

export function DocPager({ prev, next }: { prev: DocMeta | null; next: DocMeta | null }) {
  return (
    <nav className="mt-10 flex justify-between gap-4 text-sm border-t border-border pt-4">
      {prev ? <Link href={`/docs/${prev.slug}`} className="hover:text-accent">← {prev.code} {prev.title}</Link> : <span />}
      {next ? <Link href={`/docs/${next.slug}`} className="hover:text-accent text-right">{next.code} {next.title} →</Link> : <span />}
    </nav>
  );
}
