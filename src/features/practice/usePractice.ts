"use client";
import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/shared/lib/storage";
import { toDateKey } from "@/shared/lib/date";
import type { PracticeState } from "./types";
import { applyRun, EMPTY_STATE, type RunResult } from "./lib/quiz";

const store = createLocalStore("harry-practice-v1");
const subscribeNone = () => () => {};
const getToday = () => toDateKey(new Date());
const getServerToday = () => "";

function parse(raw: string): PracticeState {
  try { return raw ? { ...EMPTY_STATE, ...(JSON.parse(raw) as PracticeState) } : EMPTY_STATE; } catch { return EMPTY_STATE; }
}

/** Practice progress in localStorage. `today` is "" during SSR/hydration. */
export function usePractice() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const today = useSyncExternalStore(subscribeNone, getToday, getServerToday);
  const state = parse(raw);

  const recordRun = (setId: string, results: RunResult[]) => store.set(applyRun(state, setId, results, new Date()));
  const toggleLesson = (id: string) => {
    const lessons = { ...state.lessons };
    if (lessons[id]) delete lessons[id];
    else lessons[id] = toDateKey(new Date());
    store.set({ ...state, lessons });
  };
  const exportJson = () => JSON.stringify(state);
  const importJson = (text: string) => {
    try { store.set({ ...EMPTY_STATE, ...(JSON.parse(text) as PracticeState) }); return true; } catch { return false; }
  };

  return { ready: today !== "", today, state, recordRun, toggleLesson, exportJson, importJson };
}
