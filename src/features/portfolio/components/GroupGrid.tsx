import Link from "next/link";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { Card, H3, Muted, styles } from "@/shared/ui";
import { GROUPS, GROUP_KEYS, getDocsByGroup } from "@/features/docs/service";

export function GroupGrid() {
  const byGroup = getDocsByGroup();
  return (
    <div className={styles.grid.responsive3}>
      {GROUP_KEYS.map((g) => (
        <Link key={g} href={SITE.routes.docsGroup(g)}>
          <Card className="h-full hover:border-accent transition">
            <div className="text-2xl">{GROUPS[g].emoji}</div>
            <H3 className="mt-2">{g} · {GROUPS[g].name}</H3>
            <Muted className="mt-1">{GROUPS[g].desc}</Muted>
            <Muted size="xs" className="mt-3">{STRINGS.common.docsCount(byGroup[g].length)}</Muted>
          </Card>
        </Link>
      ))}
    </div>
  );
}
