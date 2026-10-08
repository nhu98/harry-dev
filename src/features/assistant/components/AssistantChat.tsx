"use client";
import { useEffect, useRef, useState } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, Button, Muted, styles } from "@/shared/ui";
import type { DocMeta } from "@/features/docs/types";
import { useAssistant } from "../useAssistant";
import type { Mode } from "../types";

const MODES: Mode[] = ["ask", "english", "image"];

export function AssistantChat({ docs, compact = false }: { docs: DocMeta[]; compact?: boolean }) {
  const a = useAssistant();
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [a.messages.length, a.loading]);
  const t = STRINGS.assistant;
  const errorText = a.error ? (a.error === "generic" ? t.errorGeneric : t.errors[a.error]) : null;

  const submit = () => { a.send(draft); setDraft(""); };

  return (
    <div className={compact ? "mt-2 space-y-3" : "mt-5 space-y-4"}>
      <div className={styles.control.chipRow}>
        {MODES.map((m) => (
          <button key={m} onClick={() => a.changeMode(m)}><Badge active={a.mode === m}>{t.modes[m]}</Badge></button>
        ))}
      </div>

      {a.mode === "ask" && (
        <label className={styles.chat.optionRow}>
          <span className={styles.text.small}>{t.docPickerLabel}</span>
          <select value={a.docSlug} onChange={(e) => a.setDocSlug(e.target.value)} className={styles.chat.select}>
            <option value="">{t.docPickerNone}</option>
            {docs.map((d) => <option key={d.slug} value={d.slug}>{d.code} · {d.title.slice(0, 48)}</option>)}
          </select>
        </label>
      )}

      <div ref={logRef} className={compact ? styles.chat.logCompact : styles.chat.log}>
        {a.messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? styles.chat.user : styles.chat.bot}>
            {m.text}
            {m.imageDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.imageDataUrl} alt="" className="mt-2 rounded-md max-w-full" />
            )}
          </div>
        ))}
        {a.loading && <Muted size="xs">{STRINGS.common.loading}</Muted>}
        {errorText && <Muted size="xs" className="text-red-500">{errorText}</Muted>}
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
        placeholder={t.placeholder[a.mode]}
        className={styles.chat.textarea}
      />
      <div className={styles.control.buttonRow}>
        <Button className="flex-1" onClick={submit} disabled={a.loading}>{STRINGS.common.send}</Button>
        <Button variant="outline" onClick={a.clear}>{STRINGS.common.clear}</Button>
      </div>
    </div>
  );
}
