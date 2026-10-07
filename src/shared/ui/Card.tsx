import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Props = HTMLAttributes<HTMLElement> & { as?: "div" | "article" | "li" | "section" };

/** Bordered surface. Use `as` to render as article/li/section when semantics matter. */
export function Card({ className, as: Tag = "div", ...rest }: Props) {
  return <Tag className={cn("rounded-lg border border-border bg-card p-4", className)} {...rest} />;
}
