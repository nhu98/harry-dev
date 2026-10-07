import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

export function Badge({ className, active, ...rest }: ComponentProps<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block text-xs px-2.5 py-1 rounded-full border whitespace-nowrap",
        active ? "bg-accent text-white border-accent" : "border-border bg-card",
        className,
      )}
      {...rest}
    />
  );
}
