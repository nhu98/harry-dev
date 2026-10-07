import type { ReactNode } from "react";
import { H2, Muted } from "./Heading";

export function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <H2>{title}</H2>
      {description && <Muted className="mt-1">{description}</Muted>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
