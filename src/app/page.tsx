import { STRINGS } from "@/config/strings";
import { Section, styles } from "@/shared/ui";
import { Hero } from "@/features/portfolio/components/Hero";
import { WorkGrid } from "@/features/portfolio/components/WorkGrid";
import { GroupGrid } from "@/features/portfolio/components/GroupGrid";
import { RepoList } from "@/features/portfolio/components/RepoList";

export default function HomePage() {
  const t = STRINGS.home;
  return (
    <div className={styles.layout.homeStack}>
      <Hero />
      <Section title={t.work}><WorkGrid /></Section>
      <Section title={t.knowledge} description={t.knowledgeDesc}><GroupGrid /></Section>
      <Section title={t.repos}><RepoList /></Section>
    </div>
  );
}
