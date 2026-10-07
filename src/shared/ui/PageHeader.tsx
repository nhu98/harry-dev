import type { ReactNode } from "react";

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
