/** Public API of the docs feature. Pages import from here only. */
import type { Doc, DocMeta, Group } from "./types";
import { loadAll } from "./lib/repository";
import { renderMarkdown, extractHeadings } from "./lib/markdown";
import { rewriteDocLinks } from "./lib/links";

export function getAllDocs(): DocMeta[] {
  return loadAll().map((d) => d.meta);
}

export function getDocsByGroup(): Record<Group, DocMeta[]> {
  const out = { A: [], B: [], C: [], D: [], E: [] } as Record<Group, DocMeta[]>;
  for (const d of getAllDocs()) out[d.group].push(d);
  return out;
}

export async function getDoc(slug: string): Promise<Doc | null> {
  const docs = loadAll();
  const i = docs.findIndex((d) => d.meta.slug === slug);
  if (i === -1) return null;
  const published = new Set(docs.map((d) => d.meta.slug));
  const md = rewriteDocLinks(docs[i].body, published);
  return {
    meta: docs[i].meta,
    html: await renderMarkdown(md),
    headings: extractHeadings(md).slice(0, 40),
    prev: docs[i - 1]?.meta ?? null,
    next: docs[i + 1]?.meta ?? null,
  };
}

export { GROUPS, GROUP_KEYS } from "./groups";
export type { Doc, DocMeta, Group, Heading } from "./types";
