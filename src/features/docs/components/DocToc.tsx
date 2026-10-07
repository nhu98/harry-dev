import type { Heading } from "../types";

function List({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-1.5 text-muted">
      {headings.map((h) => (
        <li key={h.id}><a href={`#${h.id}`} className="block hover:text-accent line-clamp-2">{h.text}</a></li>
      ))}
    </ol>
  );
}

/** Mobile: collapsible <details>. Desktop: sticky sidebar. Same data, two layouts. */
export function DocToc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <>
      <details className="lg:hidden mt-4 rounded-md border border-border bg-card px-3 py-2 text-sm">
        <summary className="cursor-pointer font-medium">Mục lục</summary>
        <div className="mt-2"><List headings={headings} /></div>
      </details>
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[80vh] overflow-y-auto text-sm border-l border-border pl-3">
          <p className="font-medium mb-2">Mục lục</p>
          <List headings={headings} />
        </div>
      </aside>
    </>
  );
}
