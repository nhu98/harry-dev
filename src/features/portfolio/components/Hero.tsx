import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { Badge, ButtonLink, Muted, styles } from "@/shared/ui";
import { STACK } from "../profile";
import { Hero3D } from "./Hero3D";

export function Hero() {
  const t = STRINGS.home;
  return (
    <section className={`mt-4 ${styles.hero3d.wrap}`}>
      <Hero3D />
      <div className={styles.hero3d.content}>
      <Muted>{SITE.fullName}</Muted>
      <h1 className={`mt-2 ${styles.text.hero}`}>
        {t.headline}<br className="hidden sm:block" /> {t.subheadline}
      </h1>
      <p className={`mt-4 max-w-2xl ${styles.text.muted}`}>{t.intro}</p>
      <div className="mt-6 flex flex-wrap gap-2">{STACK.map((s) => <Badge key={s}>{s}</Badge>)}</div>
      <div className={`mt-6 ${styles.control.buttonRow} gap-3`}>
        <ButtonLink href="/today">{STRINGS.nav.today}</ButtonLink>
        <ButtonLink href="/docs" variant="outline">{t.ctaDocs}</ButtonLink>
        <ButtonLink href={SITE.github} variant="outline">{t.ctaGithub}</ButtonLink>
      </div>
      </div>
    </section>
  );
}
