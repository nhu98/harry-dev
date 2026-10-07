import { styles } from "@/shared/ui";

/** Renders trusted HTML produced at build time from our own markdown. */
export function DocArticle({ html }: { html: string }) {
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
