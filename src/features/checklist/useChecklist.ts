"use client";
import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/shared/lib/storage";
import { addDays, toDateKey } from "@/shared/lib/date";
import { MIN_TASKS } from "./tasks";

export type ChecklistState = Record<string, string[]>; // dateKey → done task ids

const store = createLocalStore("harry-checklist-v1");

function parse(raw: string): ChecklistState {
  try { return raw ? (JSON.parse(raw) as ChecklistState) : {}; } catch { return {}; }
}

export function isDayComplete(state: ChecklistState, dateKey: string): boolean {
  const done = state[dateKey] ?? [];
  return MIN_TASKS.every((t) => done.includes(t.id));
}

export function countStreak(state: ChecklistState, from: Date): number {
  let n = 0;
  for (let d = from; isDayComplete(state, toDateKey(d)); d = addDays(d, -1)) n++;
  return n;
}

/** Today's checklist backed by localStorage. `ready` is false during SSR/hydration. */
export function useChecklist() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const ready = typeof window !== "undefined";
  const state = parse(raw);
  const today = ready ? toDateKey(new Date()) : "";
  const done = state[today] ?? [];

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    store.set({ ...state, [today]: next });
  };

  return {
    ready,
    today,
    done,
    toggle,
    minDone: MIN_TASKS.filter((t) => done.includes(t.id)).length,
    minTotal: MIN_TASKS.length,
    streak: ready ? countStreak(state, new Date()) : 0,
  };
}
