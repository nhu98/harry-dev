import { STRINGS } from "@/config/strings";
import { Muted, TextLink } from "@/shared/ui";
import { GROUPS } from "../groups";
import type { DocMeta } from "../types";

export function DocBreadcrumb({ meta }: { meta: DocMeta }) {
  return (
    <Muted size="xs">
      <TextLink href="/docs">{STRINGS.docs.breadcrumb}</TextLink> · {meta.group} {GROUPS[meta.group].name} · {STRINGS.common.readMinutes(meta.readMinutes)}
    </Muted>
  );
}
