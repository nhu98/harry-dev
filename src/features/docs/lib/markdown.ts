/** Markdown → HTML. Pure: string in, string out. No file system here. */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import GithubSlugger from "github-slugger";
import type { Heading } from "../types";
import { rehypeTableLabels } from "./rehype-table-labels";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeTableLabels)
  .use(rehypeHighlight, { detect: false })
  .use(rehypeStringify);

export async function renderMarkdown(md: string): Promise<string> {
  return String(await processor.process(md));
}

/** Remove inline markdown so a heading/summary reads as plain text. */
export function stripMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** Headings (## / ###) with the same ids rehype-slug will generate. */
export function extractHeadings(md: string, maxDepth: 2 | 3 = 2): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###) (.+)$/.exec(line);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = stripMarkdown(m[2]);
    const id = slugger.slug(text); // must slug every heading to keep ids in sync
    if (depth <= maxDepth) out.push({ id, text, depth });
  }
  return out;
}
