import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import GithubSlugger from "github-slugger";

export type Group = "A" | "B" | "C" | "D" | "E";

export const GROUPS: Record<Group, { name: string; desc: string; emoji: string }> = {
  A: { name: "Core", desc: "JS/TS, React, Redux, testing, algorithms, backend cơ bản. Dùng chung web + mobile.", emoji: "🧱" },
  B: { name: "Web", desc: "Browser internals, performance, security, Electron, realtime, E2EE.", emoji: "🌐" },
  C: { name: "Mobile", desc: "React Native: New Architecture, performance, security, testing.", emoji: "📱" },
  D: { name: "Interview", desc: "Câu hỏi phỏng vấn và ghi chú cá nhân đã tổng hợp.", emoji: "🎯" },
  E: { name: "Plan & English", desc: "Hướng đi sự nghiệp, thời gian biểu, học liệu tiếng Anh cho dev.", emoji: "🗺️" },
};

export type Heading = { id: string; text: string; depth: 2 | 3 };

export type DocMeta = {
  slug: string;
  file: string;
  code: string;
  group: Group;
  title: string;
  summary: string;
  words: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function stripMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseFile(file: string): { meta: DocMeta; body: string } {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { content } = matter(raw);
  const lines = content.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# ")) ?? file;
  const title = stripMd(titleLine.replace(/^# /, ""));
  const quote = lines.find((l) => l.startsWith("> ") && l.length > 20) ?? "";
  const summary = stripMd(quote.replace(/^> /, "")).slice(0, 180);
  const code = file.split("-")[0];
  const group = code[0] as Group;
  return {
    meta: {
      slug: file.replace(/\.md$/, "").toLowerCase(),
      file,
      code,
      group,
      title,
      summary,
      words: content.split(/\s+/).length,
    },
    body: content,
  };
}

let cache: { meta: DocMeta; body: string }[] | null = null;
function all() {
  if (cache) return cache;
  cache = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map(parseFile);
  return cache;
}

export function getAllDocs(): DocMeta[] {
  return all().map((d) => d.meta);
}

export function getDocsByGroup(): Record<Group, DocMeta[]> {
  const out = { A: [], B: [], C: [], D: [], E: [] } as Record<Group, DocMeta[]>;
  for (const d of getAllDocs()) out[d.group].push(d);
  return out;
}

function rewriteLinks(md: string, known: Set<string>): string {
  return md.replace(
    /\[([^\]]+)\]\((?:\.\/)?([A-Za-z0-9._-]+\.md)(#[^)]*)?\)/g,
    (_m, text: string, file: string, frag: string | undefined) => {
      const slug = file.replace(/\.md$/, "").toLowerCase();
      if (known.has(slug)) return `[${text}](/docs/${slug}${frag ?? ""})`;
      // Private doc: keep only its short code (e.g. "E8") so no file names leak.
      return /\.md$/.test(text) ? text.split("-")[0] : text;
    },
  );
}

function extractHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###) (.+)$/.exec(line);
    if (!m) continue;
    const text = stripMd(m[2]);
    out.push({ id: slugger.slug(text), text, depth: m[1].length as 2 | 3 });
  }
  return out;
}

export async function getDoc(slug: string) {
  const docs = all();
  const idx = docs.findIndex((d) => d.meta.slug === slug);
  if (idx === -1) return null;
  const known = new Set(docs.map((d) => d.meta.slug));
  const md = rewriteLinks(docs[idx].body, known);
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(rehypeHighlight, { detect: false, ignoreMissing: true } as never)
      .use(rehypeStringify)
      .process(md),
  );
  return {
    meta: docs[idx].meta,
    html,
    headings: extractHeadings(md).filter((h) => h.depth === 2).slice(0, 40),
    prev: docs[idx - 1]?.meta ?? null,
    next: docs[idx + 1]?.meta ?? null,
  };
}
