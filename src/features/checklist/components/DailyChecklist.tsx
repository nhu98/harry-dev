"use client";
import { STRINGS } from "@/config/strings";
import { List, ListRow, Muted, Stat, styles } from "@/shared/ui";
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
            <ListRow key={t.id} className="items-start cursor-pointer hover:bg-transparent">
              <label className="contents">
                <input type="checkbox" checked={checked} disabled={!c.ready} onChange={() => c.toggle(t.id)} className={styles.control.checkbox} />
                <span className={cn("flex-1 text-sm", checked && styles.state.done)}>
                  {t.min && <span className="mr-1">🔴</span>}{t.label}
                </span>
                <span className={`${styles.text.tiny} whitespace-nowrap pt-0.5`}>{t.time}</span>
              </label>
            </ListRow>
          );
        })}
      </List>
      <Muted size="xs">{STRINGS.checklist.rule}</Muted>
    </div>
  );
}
