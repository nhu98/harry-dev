"use client";
import { Suspense, use, useMemo } from "react";
import { styles } from "@/shared/ui";

type Renderer = typeof import("@/shared/lib/chat-markdown");
let loader: Promise<Renderer> | null = null;
/** Loaded on first bot message only, so pages without a chat stay light. */
const load = () => (loader ??= import("@/shared/lib/chat-markdown"));

function Rendered({ text }: { text: string }) {
  const { renderChatMarkdown } = use(load());
  const html = useMemo(() => renderChatMarkdown(text), [renderChatMarkdown, text]);
  return <div className={styles.chat.botRich} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Bot reply rendered as markdown (headings, bold, lists, tables). Plain text while loading. */
export function ChatMarkdown({ text }: { text: string }) {
  return (
    <Suspense fallback={<div className={styles.chat.bot}>{text}</div>}>
      <Rendered text={text} />
    </Suspense>
  );
}
