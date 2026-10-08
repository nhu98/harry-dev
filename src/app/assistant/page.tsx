import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { PageHeader, styles } from "@/shared/ui";
import { getAllDocs } from "@/features/docs/service";
import { AssistantChat } from "@/features/assistant/components/AssistantChat";

export const metadata: Metadata = { title: STRINGS.assistant.title };

export default function AssistantPage() {
  return (
    <div className={styles.layout.narrow}>
      <PageHeader title={STRINGS.assistant.title} description={STRINGS.assistant.description} illustration={SITE.illustrations.assistant} />
      <AssistantChat docs={getAllDocs()} />
    </div>
  );
}
