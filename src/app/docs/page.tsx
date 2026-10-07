import type { Metadata } from "next";
import { PageHeader, Section } from "@/shared/ui";
import { GROUPS, GROUP_KEYS, getAllDocs, getDocsByGroup } from "@/features/docs/service";
import { DocSearch } from "@/features/docs/components/DocSearch";
import { DocList } from "@/features/docs/components/DocList";

export const metadata: Metadata = { title: "Kiến thức" };

export default function DocsIndexPage() {
  const byGroup = getDocsByGroup();
  return (
    <div className="space-y-10">
      <PageHeader title="Kho kiến thức" description="Đọc theo thứ tự A → B/C → D. Ôn gấp thì đọc phần Q&A cuối mỗi file trước.">
        <DocSearch docs={getAllDocs()} />
      </PageHeader>
      {GROUP_KEYS.map((g) => (
        <Section key={g} id={`group-${g}`} title={`${GROUPS[g].emoji} ${g} · ${GROUPS[g].name}`} description={GROUPS[g].desc}>
          <DocList docs={byGroup[g]} />
        </Section>
      ))}
    </div>
  );
}
