import type { Metadata } from "next";
import { STRINGS } from "@/config/strings";
import { PageHeader, styles } from "@/shared/ui";
import { PracticeHome } from "@/features/practice/components/PracticeHome";

export const metadata: Metadata = { title: STRINGS.practice.title };

export default function PracticePage() {
  return (
    <div className={styles.layout.narrow}>
      <PageHeader title={STRINGS.practice.title} description={STRINGS.practice.description} />
      <PracticeHome />
    </div>
  );
}
