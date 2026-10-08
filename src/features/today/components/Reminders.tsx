import { STRINGS } from "@/config/strings";
import { Badge, Card, H2, Muted, TextLink, styles } from "@/shared/ui";
import reminders from "../reminders.json";

const ICS_PATH = "/harry-lich-hoc.ics";
const DAY_VI: Record<string, string> = { MO: "T2", TU: "T3", WE: "T4", TH: "T5", FR: "T6", SA: "T7", SU: "CN" };

export function Reminders() {
  const t = STRINGS.today;
  return (
    <section className="mt-10">
      <H2>{t.reminders}</H2>
      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <TextLink href={ICS_PATH}><Badge active>{t.addToCalendar}</Badge></TextLink>
        <Muted size="xs">{t.calendarHint}</Muted>
      </div>
      <Card padded={false} className="mt-4 divide-y divide-border">
        {reminders.map((r) => (
          <div key={r.id} className="flex gap-3 px-4 py-2 text-sm">
            <span className={`${styles.text.code} w-12 shrink-0`}>{r.time}</span>
            <span className="min-w-0 flex-1">
              <span className="block">{r.title}</span>
              <Muted size="xs">{r.note}</Muted>
            </span>
            <span className={`${styles.text.tiny} whitespace-nowrap`}>{"freq" in r ? "CN cuối tháng" : r.days.length === 7 ? "mỗi ngày" : r.days.map((d) => DAY_VI[d]).join(" ")}</span>
          </div>
        ))}
      </Card>
    </section>
  );
}
