import { Card } from "@/shared/ui";
import { WORK } from "../profile";

export function WorkGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {WORK.map((w) => (
        <Card as="article" key={w.name}>
          <h3 className="font-semibold">{w.name}</h3>
          <p className="text-xs text-muted mt-0.5">{w.role}</p>
          <p className="text-sm mt-2 leading-relaxed">{w.desc}</p>
        </Card>
      ))}
    </div>
  );
}
