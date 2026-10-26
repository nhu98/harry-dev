/**
 * Markdown → HTML for untrusted chat text (AI replies). Unlike the docs renderer,
 * raw HTML is dropped and links are limited to safe schemes. Pure and sync.
 * Load it with a dynamic import: it pulls in the unified/remark stack.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import { rehypeTableLabels } from "./rehype-table-labels";

const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;

/** Models sometimes write `$\rightarrow$`. Turn the common ones into plain symbols. */
const LATEX: Record<string, string> = {
  rightarrow: "→", to: "→", Rightarrow: "⇒", leftarrow: "←", Leftarrow: "⇐", leftrightarrow: "↔",
  times: "×", checkmark: "✓", ne: "≠", neq: "≠", le: "≤", leq: "≤", ge: "≥", geq: "≥", approx: "≈",
};
const LATEX_RE = new RegExp(`\\$\\s*\\\\(${Object.keys(LATEX).join("|")})\\s*\\$`, "g");

export function cleanLatex(md: string): string {
  return md.replace(LATEX_RE, (_m, cmd: string) => LATEX[cmd]);
}

function rehypeSafeLinks() {
  return (tree: Root) => {
    visit(tree, "element", (el: Element) => {
      if (el.tagName === "img") { el.tagName = "span"; el.properties = {}; return; }
      if (el.tagName !== "a") return;
      const href = String(el.properties?.href ?? "");
      if (!SAFE_HREF.test(href)) { el.tagName = "span"; el.properties = {}; return; }
      if (/^https?:/i.test(href)) el.properties = { ...el.properties, target: "_blank", rel: ["noreferrer"] };
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSafeLinks)
  .use(rehypeTableLabels)
  .use(rehypeStringify);

export function renderChatMarkdown(md: string): string {
  return String(processor.processSync(cleanLatex(md)));
}
