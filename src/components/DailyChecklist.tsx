"use client";
import { useSyncExternalStore } from "react";
import { TASKS } from "@/data/checklist";

type Store = Record<string, string[]>; // date → done ids
const KEY = "harry-checklist-v1";
const todayKey = () => new Date().toISOString().slice(0, 10);

// Tiny external store over localStorage so React can read it safely after hydration.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const getSnapshot = () => { try { return `${todayKey()}|${localStorage.getItem(KEY) ?? "{}"}`; } catch { return `${todayKey()}|{}`; } };
const getServerSnapshot = () => "|{}";

function streak(store: Store): number {
  let n = 0;
  const d = new Date();
  for (;;) {
    const done = store[d.toISOString().slice(0, 10)] ?? [];
    if (!TASKS.filter((t) => t.min).every((t) => done.includes(t.id))) break;
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function DailyChecklist() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sep = snap.indexOf("|");
  const date = snap.slice(0, sep);
  const ready = date !== "";
  let store: Store = {};
  try { store = JSON.parse(snap.slice(sep + 1)); } catch {}
  const done = store[date] ?? [];

  const toggle = (id: string) => {
    const next = { ...store, [date]: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    listeners.forEach((cb) => cb());
  };

  const minTotal = TASKS.filter((t) => t.min).length;
  const minDone = TASKS.filter((t) => t.min && done.includes(t.id)).length;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex gap-3 text-sm">
        <div className="rounded-md border border-border bg-card px-3 py-2">🔴 tối thiểu: <b>{minDone}/{minTotal}</b></div>
        <div className="rounded-md border border-border bg-card px-3 py-2">Chuỗi ngày đạt: <b>{ready ? streak(store) : 0}</b> 🔥</div>
        {ready && <div className="rounded-md border border-border bg-card px-3 py-2 text-muted">{date}</div>}
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {TASKS.map((t) => {
          const checked = done.includes(t.id);
          return (
            <li key={t.id}>
              <label className="flex items-start gap-3 px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={checked} disabled={!ready} onChange={() => toggle(t.id)} className="mt-1 size-4 accent-blue-600" />
                <span className={`flex-1 text-sm ${checked ? "line-through text-muted" : ""}`}>
                  {t.min && <span className="mr-1">🔴</span>}{t.label}
                </span>
                <span className="text-xs text-muted whitespace-nowrap pt-0.5">{t.time}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">Luật: ngày lười làm dòng 🔴 vẫn tính đạt. Không bỏ 2 ngày liên tiếp.</p>
    </div>
  );
}
