import { Card } from "@/shared/ui";
import { REPOS } from "../profile";

export function RepoList() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {REPOS.map((r) => (
        <Card as="li" key={r.name} className="flex items-start justify-between gap-3">
          <div>
            <a href={r.url} target="_blank" rel="noreferrer" className="font-medium hover:text-accent">{r.name}</a>
            <p className="text-sm text-muted">{r.desc}</p>
          </div>
          {r.demo && <a href={r.demo} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded border border-border whitespace-nowrap">Demo ↗</a>}
        </Card>
      ))}
    </ul>
  );
}
