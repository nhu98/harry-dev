/** Renders trusted HTML produced at build time from our own markdown. */
export function DocArticle({ html }: { html: string }) {
  return (
    <div
      className="doc prose prose-neutral dark:prose-invert mt-4 prose-headings:tracking-tight prose-a:text-accent prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
