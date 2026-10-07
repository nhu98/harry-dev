import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui";
import { Flashcards } from "@/features/phrases/components/Flashcards";

export const metadata: Metadata = { title: "Câu mẫu tiếng Anh" };

export default function PhrasesPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Câu mẫu tiếng Anh đi làm" description="Câu ngắn, mức A2. Chạm thẻ để lật. Đọc to 5 lần mỗi câu." />
      <Flashcards />
    </div>
  );
}
