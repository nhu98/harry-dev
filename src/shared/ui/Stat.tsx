import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/shared/lib/cn";

/** Small label/value box used in summary rows. */
export function Stat({ label, value, className }: { label?: ReactNode; value: ReactNode; className?: string }) {
  return (
    <Card className={cn("px-3 py-2 text-sm", className)}>
      {label && <>{label}: </>}<b>{value}</b>
    </Card>
  );
}
