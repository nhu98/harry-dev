import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "outline" | "ghost";

const base = "inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 whitespace-nowrap transition active:scale-[0.98]";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:opacity-90",
  outline: "border border-border bg-card hover:border-accent",
  ghost: "text-muted hover:text-foreground",
};

type Props = { variant?: Variant; className?: string };

export function Button({ variant = "primary", className, ...rest }: Props & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], className)} {...rest} />;
}

export function ButtonLink({ variant = "primary", className, href, ...rest }: Props & ComponentProps<typeof Link>) {
  const external = typeof href === "string" && href.startsWith("http");
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    />
  );
}
