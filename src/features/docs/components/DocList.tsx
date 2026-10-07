import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { List, ListRow, styles } from "@/shared/ui";
import type { DocMeta } from "../types";

export function DocList({ docs }: { docs: DocMeta[] }) {
  return (
    <List>
      {docs.map((d) => (
        <ListRow key={d.slug} href={SITE.routes.docs(d.slug)}>
          <span className={`${styles.text.code} pt-1 w-7 shrink-0`}>{d.code}</span>
          <span className="min-w-0">
            <span className="block font-medium">{d.title}</span>
            <span className={`block ${styles.text.small} line-clamp-2`}>{d.summary}</span>
            <span className={`block ${styles.text.tiny} mt-1`}>{STRINGS.common.readMinutes(d.readMinutes)}</span>
          </span>
        </ListRow>
      ))}
    </List>
  );
}
