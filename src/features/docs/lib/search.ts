/**
 * Keyword retrieval over every published doc, split by "##" sections.
 * Good enough for "answer from my notes" without embeddings or a vector DB.
 */
import { loadAll } from "./repository";

export type Section = { slug: string; docTitle: string; heading: string; text: string };

let index: Section[] | null = null;

function buildIndex(): Section[] {
  const out: Section[] = [];
  for (const d of loadAll()) {
    const parts = d.body.split(/\n(?=## )/);
    for (const p of parts) {
      const heading = (/^## (.+)$/m.exec(p)?.[1] ?? d.meta.title).trim();
      out.push({ slug: d.meta.slug, docTitle: d.meta.title, heading, text: p });
    }
  }
  return out;
}

const tokenize = (s: string) =>
  s.toLowerCase().normalize("NFC").split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 3);

export function searchSections(query: string, opts: { limit: number; maxChars: number }): Section[] {
  index ??= buildIndex();
  const terms = Array.from(new Set(tokenize(query)));
  if (terms.length === 0) return [];
  const scored = index
    .map((s) => {
      const hay = s.text.toLowerCase();
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 + Math.min(3, hay.split(t).length - 1) * 0.1 : 0), 0);
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const picked: Section[] = [];
  let chars = 0;
  for (const { s } of scored) {
    if (picked.length >= opts.limit) break;
    const slice = s.text.slice(0, Math.max(0, opts.maxChars - chars));
    if (slice.length < 200) break;
    picked.push({ ...s, text: slice });
    chars += slice.length;
  }
  return picked;
}
