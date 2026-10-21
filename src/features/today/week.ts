import { planFor, type Block, type Weekday } from "./plan";

/** Columns Monday → Sunday, as people read a week in Vietnam. */
export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
/** Blocks with a non-clock time ("Sáng") sit right after 9h. */
const FALLBACK_MINUTES = 9 * 60 + 15;

export type WeekRow = { time: string; cells: (Block | null)[] };

function minutes(time: string): number {
  const m = /(\d+)h(\d+)?/.exec(time);
  return m ? Number(m[1]) * 60 + Number(m[2] ?? 0) : FALLBACK_MINUTES;
}

/** One row per distinct start time; each cell is that day's block at that time, or null. */
export function weekRows(): WeekRow[] {
  const byDay = WEEK_ORDER.map((d) => planFor(d));
  const times = [...new Set(byDay.flat().map((b) => b.time))].sort((a, b) => minutes(a) - minutes(b));
  return times.map((time) => ({ time, cells: byDay.map((blocks) => blocks.find((b) => b.time === time) ?? null) }));
}

/** Where a cell click goes: the block's first link, if any. */
export function primaryHref(b: Block): string | null {
  return b.links[0]?.href ?? null;
}
