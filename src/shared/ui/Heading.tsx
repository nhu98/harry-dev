import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

export function H1({ className, ...rest }: ComponentProps<"h1">) { return <h1 className={cn(styles.text.h1, className)} {...rest} />; }
export function H2({ className, ...rest }: ComponentProps<"h2">) { return <h2 className={cn(styles.text.h2, className)} {...rest} />; }
export function H3({ className, ...rest }: ComponentProps<"h3">) { return <h3 className={cn(styles.text.h3, className)} {...rest} />; }
export function Muted({ className, size = "sm", ...rest }: ComponentProps<"p"> & { size?: "sm" | "xs" }) {
  return <p className={cn(size === "sm" ? styles.text.small : styles.text.tiny, className)} {...rest} />;
}
