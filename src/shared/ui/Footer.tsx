import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";
import { TextLink } from "./TextLink";

export function Footer() {
  return (
    <footer className={cn("border-t border-border", styles.text.small)}>
      <div className={cn(styles.layout.container, "py-6 flex flex-wrap gap-x-6 gap-y-2")}>
        <span>© {SITE.year} {SITE.owner}</span>
        <TextLink href={SITE.github}>{STRINGS.footer.github}</TextLink>
        <span>{STRINGS.footer.builtWith}</span>
      </div>
    </footer>
  );
}
