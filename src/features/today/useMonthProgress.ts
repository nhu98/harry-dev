"use client";
import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/shared/lib/storage";

type Progress = Record<string, { efset?: number; units?: number }>; // month → values
const store = createLocalStore("harry-month-progress-v1");

export function useMonthProgress(month: string) {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  let all: Progress = {};
  try { all = raw ? (JSON.parse(raw) as Progress) : {}; } catch {}
  const cur = all[month] ?? {};
  const set = (patch: Partial<{ efset: number; units: number }>) => store.set({ ...all, [month]: { ...cur, ...patch } });
  return { efset: cur.efset, units: cur.units, set };
}
