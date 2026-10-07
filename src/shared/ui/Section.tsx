import type { ReactNode } from "react";

export function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
