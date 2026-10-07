/**
 * The only module that touches the file system for docs.
 * Swap this file (e.g. for a CMS) and nothing else in the feature changes.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { DocMeta, Group } from "../types";
import { stripMarkdown } from "./markdown";
import { fileToSlug } from "./links";

const CONTENT_DIR = path.join(process.cwd(), "content");
const WORDS_PER_MINUTE = 200;

type Raw = { meta: DocMeta; body: string };

function parse(file: string): Raw {
  const { content } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  const lines = content.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# ")) ?? file;
  const quote = lines.find((l) => l.startsWith("> ") && l.length > 20) ?? "";
  const code = file.split("-")[0];
  return {
    meta: {
      slug: fileToSlug(file),
      file,
      code,
      group: code[0] as Group,
      title: stripMarkdown(titleLine.slice(2)),
      summary: stripMarkdown(quote.slice(2)).slice(0, 180),
      readMinutes: Math.max(1, Math.round(content.split(/\s+/).length / WORDS_PER_MINUTE)),
    },
    body: content,
  };
}

let cache: Raw[] | null = null;

/** All docs, sorted by file name (A1, A2, ..., E7). Cached for the build. */
export function loadAll(): Raw[] {
  if (!cache) {
    cache = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort().map(parse);
  }
  return cache;
}
