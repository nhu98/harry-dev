import { STRINGS } from "@/config/strings";
import { Card, styles } from "@/shared/ui";
import type { Heading } from "../types";

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className={`space-y-1.5 ${styles.text.muted}`}>
      {headings.map((h) => (
        <li key={h.id}><a href={`#${h.id}`} className={`block ${styles.link.subtle} line-clamp-2`}>{h.text}</a></li>
      ))}
    </ol>
  );
}

/** Mobile: collapsible. Desktop: sticky sidebar. Parent decides which to show. */
export function DocToc({ headings, variant }: { headings: Heading[]; variant: "mobile" | "desktop" }) {
  if (headings.length === 0) return null;
  if (variant === "mobile") {
    return (
      <Card as="div" padded={false} className="mt-4 px-3 py-2 text-sm">
        <details>
          <summary className="cursor-pointer font-medium">{STRINGS.common.toc}</summary>
          <div className="mt-2"><TocList headings={headings} /></div>
        </details>
      </Card>
    );
  }
  return (
    <aside className={`${styles.surface.sticky} text-sm border-l border-border pl-3`}>
      <p className="font-medium mb-2">{STRINGS.common.toc}</p>
      <TocList headings={headings} />
    </aside>
  );
}
