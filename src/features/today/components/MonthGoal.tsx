"use client";
import { useSyncExternalStore } from "react";
import { STRINGS } from "@/config/strings";
import { Card, H2, Input, Muted, Stat, styles } from "@/shared/ui";
import { milestoneFor } from "../milestones";
import { useMonthProgress } from "../useMonthProgress";

const subscribe = () => () => {};
const getKey = () => new Date().toISOString().slice(0, 7);
const getServerKey = () => "";

export function MonthGoal() {
  const month = useSyncExternalStore(subscribe, getKey, getServerKey);
  const p = useMonthProgress(month || "ssr");
  const t = STRINGS.today;
  if (!month) return null;
  const m = milestoneFor(new Date());
  const efsetOk = p.efset !== undefined && p.efset >= m.efset;
  const unitsOk = p.units !== undefined && p.units >= m.units;
  return (
    <section className="mt-10">
      <H2>{t.monthGoal}: {m.label}</H2>
      <Muted className="mt-1">{m.note}</Muted>
      <Muted size="xs" className="mt-1">{t.monthGoalHint}</Muted>
      <Card className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          {t.efsetScore} · {t.efsetTarget} ≥ {m.efset} {efsetOk ? "✅" : ""}
          <Input type="number" inputMode="numeric" className="mt-1" value={p.efset ?? ""} onChange={(e) => p.set({ efset: Number(e.target.value) || 0 })} />
        </label>
        <label className="text-sm">
          {t.unitsDone} · {t.efsetTarget} {m.units} {unitsOk ? "✅" : ""}
          <Input type="number" inputMode="numeric" className="mt-1" value={p.units ?? ""} onChange={(e) => p.set({ units: Number(e.target.value) || 0 })} />
        </label>
      </Card>
      <div className={`mt-3 flex gap-3 ${styles.text.small}`}>
        <Stat label="A2" value="31–40" /><Stat label="B1" value="41–50" />
      </div>
    </section>
  );
}
