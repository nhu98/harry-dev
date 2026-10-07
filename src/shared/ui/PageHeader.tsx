import type { ReactNode } from "react";
import { H1, Muted } from "./Heading";
import { styles } from "./styles";

type Props = { title: string; description?: string; illustration?: string; children?: ReactNode };

export function PageHeader({ title, description, illustration, children }: Props) {
  return (
    <div className={illustration ? styles.illustration.header : undefined}>
      <div className="min-w-0">
        <H1>{title}</H1>
        {description && <Muted className="mt-1">{description}</Muted>}
        {children && <div className="mt-4">{children}</div>}
      </div>
      {illustration && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={illustration} alt="" className={styles.illustration.img} aria-hidden />
      )}
    </div>
  );
}
