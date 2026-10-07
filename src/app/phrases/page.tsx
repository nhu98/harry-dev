import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { PageHeader } from "@/shared/ui";
import { Flashcards } from "@/features/phrases/components/Flashcards";

export const metadata: Metadata = { title: STRINGS.phrases.title };

export default function PhrasesPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title={STRINGS.phrases.title} description={STRINGS.phrases.description} illustration={SITE.illustrations.phrases} />
      <Flashcards />
    </div>
  );
}
