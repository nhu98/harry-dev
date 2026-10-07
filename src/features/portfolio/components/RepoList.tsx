import { STRINGS } from "@/config/strings";
import { Badge, Card, Muted, TextLink, styles } from "@/shared/ui";
import { REPOS } from "../profile";

export function RepoList() {
  return (
    <ul className={styles.grid.two}>
      {REPOS.map((r) => (
        <Card as="li" key={r.name} className="flex items-start justify-between gap-3">
          <div>
            <TextLink href={r.url} className="font-medium">{r.name}</TextLink>
            <Muted>{r.desc}</Muted>
          </div>
          {r.demo && <TextLink href={r.demo}><Badge>{STRINGS.common.demo}</Badge></TextLink>}
        </Card>
      ))}
    </ul>
  );
}
