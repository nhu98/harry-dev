"use client";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { Button, List, Muted, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { formatShort } from "@/shared/lib/date";
import type { Thread } from "../types";

type Props = {
  threads: Thread[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  compact?: boolean;
};

export function ThreadHistory({ threads, activeId, onOpen, onDelete, onClearAll, compact = false }: Props) {
  const t = STRINGS.assistant;
  if (threads.length === 0) return <Muted>{t.history.empty}</Muted>;
  return (
    <div className="space-y-3">
      <div className={compact ? styles.chat.logCompact : styles.chat.log}>
        <List>
          {threads.map((th) => (
            <li key={th.id} className={cn(styles.chat.threadRow, th.id === activeId && styles.chat.threadActive)}>
              <button className={styles.chat.threadMain} onClick={() => onOpen(th.id)}>
                <span className={styles.chat.threadTitle}>{th.title}</span>
                <span className={`block ${styles.text.tiny}`}>{t.modes[th.mode]} · {t.history.count(th.messages.length)} · {formatShort(th.updatedAt)}</span>
              </button>
              <Button variant="ghost" className="px-2 py-1" onClick={() => onDelete(th.id)} aria-label={t.history.deleteLabel}>{t.history.deleteIcon}</Button>
            </li>
          ))}
        </List>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Muted size="xs">{t.history.retention(SITE.assistant.maxAgeDays, SITE.assistant.maxThreads)}</Muted>
        <Button variant="outline" className="px-2 py-1 text-xs whitespace-nowrap" onClick={() => { if (window.confirm(t.history.confirmClear)) onClearAll(); }}>{t.history.clearAll}</Button>
      </div>
    </div>
  );
}
