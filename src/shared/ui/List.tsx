import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

/** Bordered list with dividers. Rows are plain or links. */
export function List({ className, ...rest }: ComponentProps<"ul">) {
  return <ul className={cn(styles.surface.list, className)} {...rest} />;
}

export function ListRow({ href, children, className }: { href?: string; children: ReactNode; className?: string }) {
  const cls = cn(styles.surface.listRow, className);
  return <li>{href ? <Link href={href} className={cls}>{children}</Link> : <div className={cls}>{children}</div>}</li>;
}
