import type { Metadata } from "next";
import { Flashcards } from "@/components/Flashcards";

export const metadata: Metadata = { title: "Câu mẫu tiếng Anh" };

export default function PhrasesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Câu mẫu tiếng Anh đi làm</h1>
      <p className="text-sm text-muted mt-1">Câu ngắn, mức A2. Chạm thẻ để lật. Đọc to 5 lần mỗi câu.</p>
      <Flashcards />
    </div>
  );
}
