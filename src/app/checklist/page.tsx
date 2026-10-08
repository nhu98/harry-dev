import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { PageHeader, styles } from "@/shared/ui";
import { DailyChecklist } from "@/features/checklist/components/DailyChecklist";

export const metadata: Metadata = { title: STRINGS.checklist.title };

export default function ChecklistPage() {
  return (
    <div className={styles.layout.narrow}>
      <PageHeader title={STRINGS.checklist.title} description={STRINGS.checklist.description} illustration={SITE.illustrations.checklist} />
      <DailyChecklist />
    </div>
  );
}
