import type { Metadata } from "next";
import { STRINGS } from "@/config/strings";
import { Badge, PageHeader, TextLink } from "@/shared/ui";
import { SITE } from "@/config/site";
import { WeekTable } from "@/features/today/components/WeekTable";

export const metadata: Metadata = { title: STRINGS.schedule.title };

export default function SchedulePage() {
  const t = STRINGS.schedule;
  return (
    <div>
      <PageHeader title={t.title} description={t.description}>
        <TextLink href={SITE.routes.practice}><Badge active>{t.practiceLink}</Badge></TextLink>
      </PageHeader>
      <WeekTable />
    </div>
  );
}
