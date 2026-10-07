import type { ReactNode } from "react";
import { H1, Muted } from "./Heading";

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div>
      <H1>{title}</H1>
      {description && <Muted className="mt-1">{description}</Muted>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
