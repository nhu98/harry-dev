import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(styles.control.input, className)} {...rest} />;
}
