import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui";
import { DailyChecklist } from "@/features/checklist/components/DailyChecklist";

export const metadata: Metadata = { title: "Checklist hôm nay" };

export default function ChecklistPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="Checklist hôm nay" description="Theo thời gian biểu E5. Ngày lười chỉ cần làm các dòng 🔴. Lưu trên máy này (localStorage), không cần đăng nhập." />
      <DailyChecklist />
    </div>
  );
}
