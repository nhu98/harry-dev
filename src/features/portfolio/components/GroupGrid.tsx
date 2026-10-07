import Link from "next/link";
import { Card } from "@/shared/ui";
import { GROUPS, GROUP_KEYS, getDocsByGroup } from "@/features/docs/service";

export function GroupGrid() {
  const byGroup = getDocsByGroup();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GROUP_KEYS.map((g) => (
        <Link key={g} href={`/docs#group-${g}`}>
          <Card className="h-full hover:border-accent transition">
            <div className="text-2xl">{GROUPS[g].emoji}</div>
            <h3 className="font-semibold mt-2">{g} · {GROUPS[g].name}</h3>
            <p className="text-sm text-muted mt-1">{GROUPS[g].desc}</p>
            <p className="text-xs text-muted mt-3">{byGroup[g].length} tài liệu</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
