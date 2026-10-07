import { Section } from "@/shared/ui";
import { Hero } from "@/features/portfolio/components/Hero";
import { WorkGrid } from "@/features/portfolio/components/WorkGrid";
import { GroupGrid } from "@/features/portfolio/components/GroupGrid";
import { RepoList } from "@/features/portfolio/components/RepoList";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <Hero />
      <Section title="Dự án đã làm"><WorkGrid /></Section>
      <Section title="Kho kiến thức" description="Markdown tự tổng hợp, song ngữ VI/EN, build tĩnh từ repo."><GroupGrid /></Section>
      <Section title="Dự án cá nhân trên GitHub"><RepoList /></Section>
    </div>
  );
}
