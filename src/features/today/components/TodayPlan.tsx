"use client";
import { useSyncExternalStore } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, Card, H3, Muted, TextLink, styles } from "@/shared/ui";
import { planFor, type Weekday } from "../plan";

const subscribe = () => () => {};
const getDay = () => String(new Date().getDay());
const getServerDay = () => "";

export function TodayPlan() {
  const raw = useSyncExternalStore(subscribe, getDay, getServerDay);
  const t = STRINGS.today;
  if (raw === "") return <Muted className="mt-4">…</Muted>;
  const day = Number(raw) as Weekday;
  const blocks = planFor(day);
  const weekend = day === 0 || day === 6;
  return (
    <div className="mt-5 space-y-3">
      <Badge active>{t.weekday[day]}</Badge>
      {weekend && <Muted>{t.weekend}</Muted>}
      {blocks.map((b) => (
        <Card key={`${b.time}-${b.title}`} className="flex gap-3">
          <span className={`${styles.text.code} w-12 shrink-0 pt-1`}>{b.time}</span>
          <div className="min-w-0">
            <H3>{b.title}</H3>
            <Muted className="mt-1">{b.how}</Muted>
            {b.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {b.links.map((l) => <TextLink key={l.href} href={l.href}><Badge>{t.open}: {l.label}</Badge></TextLink>)}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
