"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, H3, Muted, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import type { Block } from "../plan";
import { primaryHref, WEEK_ORDER, weekRows } from "../week";

const subscribe = () => () => {};
const getDay = () => new Date().getDay();
const getServerDay = () => -1;

function CellLink({ block, className, plainClass, children }: { block: Block; className: string; plainClass: string; children: React.ReactNode }) {
  const href = primaryHref(block);
  if (!href) return <span className={plainClass} title={block.how}>{children}</span>;
  const external = href.startsWith("http");
  return (
    <Link href={href} className={className} title={block.how} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </Link>
  );
}

/** Weekly timetable: grid on desktop, one list per day on phones. Each block links to where you study. */
export function WeekTable() {
  const today = useSyncExternalStore(subscribe, getDay, getServerDay);
  const t = STRINGS.schedule;
  const rows = weekRows();
  const days = STRINGS.today.weekday;

  return (
    <div className="mt-6">
      <Muted size="xs" className="mb-3">{t.legend}</Muted>
      <table className={styles.week.table}>
        <thead>
          <tr>
            <th className={cn(styles.week.th, styles.week.thIdle)}>{t.time}</th>
            {WEEK_ORDER.map((d) => <th key={d} className={cn(styles.week.th, d === today ? styles.week.thToday : styles.week.thIdle)}>{days[d]}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.time}>
              <td className={styles.week.timeCell}>{r.time}</td>
              {r.cells.map((b, i) => (
                <td key={WEEK_ORDER[i]} className={cn(styles.week.td, WEEK_ORDER[i] === today && styles.week.tdToday)}>
                  {b && <CellLink block={b} className={styles.week.cellLink} plainClass={styles.week.cellPlain}>{b.title}</CellLink>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.week.mobileList}>
        {WEEK_ORDER.map((d, i) => (
          <details key={d} open={d === today} className="group">
            <summary className="cursor-pointer py-1">
              <H3 className="inline">{days[d]}</H3> {d === today && <Badge active>{t.today}</Badge>}
            </summary>
            <div className="mt-2 space-y-2">
              {rows.filter((r) => r.cells[i]).map((r) => {
                const b = r.cells[i]!;
                return (
                  <CellLink key={r.time} block={b} className={styles.week.mobileRow} plainClass={styles.week.mobileRowPlain}>
                    <span className={`${styles.text.code} w-12 shrink-0`}>{r.time}</span>
                    <span className="min-w-0 text-sm">{b.title}</span>
                  </CellLink>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
