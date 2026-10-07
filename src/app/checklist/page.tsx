import type { Metadata } from "next";
import { DailyChecklist } from "@/components/DailyChecklist";

export const metadata: Metadata = { title: "Checklist hôm nay" };

export default function ChecklistPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Checklist hôm nay</h1>
      <p className="text-sm text-muted mt-1">
        Theo thời gian biểu E5. Ngày lười chỉ cần làm các dòng 🔴. Lưu trên máy này (localStorage), không cần đăng nhập.
      </p>
      <DailyChecklist />
    </div>
  );
}
