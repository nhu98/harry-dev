import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

/** Inline link. External hrefs open in a new tab automatically. */
export function TextLink({ className, href, ...rest }: ComponentProps<typeof Link>) {
  const external = typeof href === "string" && href.startsWith("http");
  return (
    <Link href={href} className={cn(styles.link.subtle, className)} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest} />
  );
}
