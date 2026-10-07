"use client";
import { STRINGS } from "@/config/strings";
import { List, ListRow, Muted, Stat, TextLink, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { TASKS } from "../tasks";
import { useChecklist } from "../useChecklist";

export function DailyChecklist() {
  const c = useChecklist();
  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap gap-3">
        <Stat label={STRINGS.checklist.minimum} value={`${c.minDone}/${c.minTotal}`} />
        <Stat label={STRINGS.checklist.streak} value={`${c.streak} 🔥`} />
        {c.ready && <Stat value={c.today} className={styles.text.muted} />}
      </div>
      <List>
        {TASKS.map((t) => {
          const checked = c.done.includes(t.id);
          return (
            <ListRow key={t.id} className="items-start hover:bg-transparent">
              <input type="checkbox" checked={checked} disabled={!c.ready} onChange={() => c.toggle(t.id)} className={styles.control.checkbox} />
              <span className="flex-1 min-w-0">
                <label className={cn("block text-sm cursor-pointer", checked && styles.state.done)} onClick={() => c.ready && c.toggle(t.id)}>
                  {t.min && <span className="mr-1">🔴</span>}{t.label}
                </label>
                <Muted size="xs" className="mt-1">{t.how} <TextLink href={t.guide} className="text-accent">{STRINGS.common.howTo}</TextLink></Muted>
              </span>
              <span className={`${styles.text.tiny} whitespace-nowrap pt-0.5`}>{t.time}</span>
            </ListRow>
          );
        })}
      </List>
      <Muted size="xs">{STRINGS.checklist.rule}</Muted>
    </div>
  );
}
