import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { Badge, PageHeader, TextLink, styles } from "@/shared/ui";
import { TodayPlan } from "@/features/today/components/TodayPlan";
import { Reminders } from "@/features/today/components/Reminders";

export const metadata: Metadata = { title: STRINGS.today.title };

export default function TodayPage() {
  const t = STRINGS.today;
  return (
    <div className="max-w-2xl">
      <PageHeader title={t.title} description={t.description} illustration={SITE.illustrations.today}>
        <div className={styles.control.chipRow}>
          <TextLink href="/checklist"><Badge active>{t.checklist}</Badge></TextLink>
          <TextLink href={SITE.routes.docs("e11-huong-dan-tung-ngay")}><Badge>{t.fullGuide}</Badge></TextLink>
          <TextLink href={SITE.routes.docs("e8-ke-hoach-6-thang-review-thang-4")}><Badge>{t.plan}</Badge></TextLink>
          <TextLink href={SITE.routes.docs("e5-thoi-gian-bieu-tieng-anh")}><Badge>{t.schedule}</Badge></TextLink>
        </div>
      </PageHeader>
      <TodayPlan />
      <Reminders />
    </div>
  );
}
