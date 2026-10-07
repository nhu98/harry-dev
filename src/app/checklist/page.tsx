import type { Metadata } from "next";
import { STRINGS } from "@/config/strings";
import { PageHeader } from "@/shared/ui";
import { DailyChecklist } from "@/features/checklist/components/DailyChecklist";

export const metadata: Metadata = { title: STRINGS.checklist.title };

export default function ChecklistPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title={STRINGS.checklist.title} description={STRINGS.checklist.description} />
      <DailyChecklist />
    </div>
  );
}
