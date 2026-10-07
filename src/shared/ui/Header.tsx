"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/config/site";
import { cn } from "@/shared/lib/cn";

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          Harry<span className="text-accent">.dev</span>
        </Link>
        <nav className="flex gap-1 text-sm overflow-x-auto">
          {SITE.nav.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn("px-3 py-1.5 rounded-md whitespace-nowrap", active ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground")}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
