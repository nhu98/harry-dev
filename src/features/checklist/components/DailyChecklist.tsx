"use client";
import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { TASKS } from "../tasks";
import { useChecklist } from "../useChecklist";

export function DailyChecklist() {
  const c = useChecklist();
  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <Card className="px-3 py-2">🔴 tối thiểu: <b>{c.minDone}/{c.minTotal}</b></Card>
        <Card className="px-3 py-2">Chuỗi ngày đạt: <b>{c.streak}</b> 🔥</Card>
        {c.ready && <Card className="px-3 py-2 text-muted">{c.today}</Card>}
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {TASKS.map((t) => {
          const checked = c.done.includes(t.id);
          return (
            <li key={t.id}>
              <label className="flex items-start gap-3 px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={checked} disabled={!c.ready} onChange={() => c.toggle(t.id)} className="mt-1 size-4 accent-blue-600" />
                <span className={cn("flex-1 text-sm", checked && "line-through text-muted")}>
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
