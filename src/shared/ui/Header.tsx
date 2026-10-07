"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/config/site";
import { STRINGS } from "@/config/strings";
import { cn } from "@/shared/lib/cn";
import { styles } from "./styles";

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-background/80 border-b border-border">
      <div className={cn(styles.layout.container, "h-14 flex items-center justify-between gap-4")}>
        <Link href="/" className="font-semibold tracking-tight">
          Harry<span className="text-accent">.dev</span>
        </Link>
        <nav className="flex gap-1 text-sm overflow-x-auto">
          {SITE.nav.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={cn(styles.link.nav, active ? styles.link.navActive : styles.link.navIdle)}>
                {STRINGS.nav[n.key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
