"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { STRINGS } from "@/config/strings";
import { Button, H3, TextLink, styles } from "@/shared/ui";
import type { DocMeta } from "@/features/docs/types";
import { AssistantChat } from "./AssistantChat";

/** Floating assistant available on every page. Hidden on /assistant itself. */
export function AssistantBubble({ docs }: { docs: DocMeta[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const t = STRINGS.assistant;
  if (path.startsWith("/assistant")) return null;
  if (!open) return <button className={styles.bubble.button} onClick={() => setOpen(true)}>💬 {t.bubbleOpen}</button>;
  return (
    <div className={styles.bubble.panel}>
      <div className={styles.bubble.panelHeader}>
        <H3 className="truncate min-w-0">{t.title}</H3>
        <div className={`${styles.control.buttonRow} shrink-0`}>
          <TextLink href="/assistant" className="text-xs self-center whitespace-nowrap">{t.bubbleFull}</TextLink>
          <Button variant="outline" className="px-2 py-1" onClick={() => setOpen(false)}>{t.bubbleClose}</Button>
        </div>
      </div>
      <AssistantChat docs={docs} compact />
    </div>
  );
}
