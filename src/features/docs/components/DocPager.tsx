import { SITE } from "@/config/site";
import { TextLink, styles } from "@/shared/ui";
import type { DocMeta } from "../types";

export function DocPager({ prev, next }: { prev: DocMeta | null; next: DocMeta | null }) {
  return (
    <nav className={styles.pager}>
      {prev ? <TextLink href={SITE.routes.docs(prev.slug)}>← {prev.code} {prev.title}</TextLink> : <span />}
      {next ? <TextLink href={SITE.routes.docs(next.slug)} className="text-right">{next.code} {next.title} →</TextLink> : <span />}
    </nav>
  );
}
