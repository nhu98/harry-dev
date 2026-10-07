import { Card, H3, Muted, styles } from "@/shared/ui";
import { WORK } from "../profile";

export function WorkGrid() {
  return (
    <div className={styles.grid.three}>
      {WORK.map((w) => (
        <Card as="article" key={w.name}>
          <H3>{w.name}</H3>
          <Muted size="xs" className="mt-0.5">{w.role}</Muted>
          <p className="text-sm mt-2 leading-relaxed">{w.desc}</p>
        </Card>
      ))}
    </div>
  );
}
