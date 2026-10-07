import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

type Props = HTMLAttributes<HTMLElement> & { as?: "div" | "article" | "li" | "section"; padded?: boolean };

/** Bordered surface. `as` picks the tag; `padded={false}` for custom padding. */
export function Card({ className, as: Tag = "div", padded = true, ...rest }: Props) {
  return <Tag className={cn(padded ? styles.surface.cardPadded : styles.surface.card, className)} {...rest} />;
}
