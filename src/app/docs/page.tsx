import type { Metadata } from "next";
import { STRINGS } from "@/config/strings";
import { PageHeader, Section, styles } from "@/shared/ui";
import { GROUPS, GROUP_KEYS, getAllDocs, getDocsByGroup } from "@/features/docs/service";
import { DocSearch } from "@/features/docs/components/DocSearch";
import { DocList } from "@/features/docs/components/DocList";

export const metadata: Metadata = { title: STRINGS.docs.title };

export default function DocsIndexPage() {
  const byGroup = getDocsByGroup();
  return (
    <div className={styles.layout.pageStack}>
      <PageHeader title={STRINGS.docs.title} description={STRINGS.docs.description}>
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
