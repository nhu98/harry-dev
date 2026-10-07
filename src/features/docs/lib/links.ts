/**
 * Rewrites `[text](X.md#frag)` links between markdown files into site routes.
 * Links to files that are not published are reduced to plain text so that
 * private file names never leak into the HTML.
 */
const MD_LINK = /\[([^\]]+)\]\((?:\.\/)?([A-Za-z0-9._-]+\.md)(#[^)]*)?\)/g;

export function fileToSlug(file: string): string {
  return file.replace(/\.md$/, "").toLowerCase();
}

export function rewriteDocLinks(md: string, publishedSlugs: Set<string>): string {
  return md.replace(MD_LINK, (_m, text: string, file: string, frag = "") => {
    const slug = fileToSlug(file);
    if (publishedSlugs.has(slug)) return `[${text}](/docs/${slug}${frag})`;
    return /\.md$/.test(text) ? text.split("-")[0] : text;
  });
}
