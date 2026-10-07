"use client";
import { useState } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, Button, Input, Muted, styles } from "@/shared/ui";
import type { DocMeta } from "@/features/docs/types";
import { useAssistant } from "../useAssistant";
import type { Mode } from "../types";

const MODES: Mode[] = ["ask", "english", "image"];

export function AssistantChat({ docs }: { docs: DocMeta[] }) {
  const a = useAssistant();
  const [draft, setDraft] = useState("");
  const t = STRINGS.assistant;
  const errorText = a.error ? (a.error === "generic" ? t.errorGeneric : t.errors[a.error]) : null;

  const submit = () => { a.send(draft); setDraft(""); };

  return (
    <div className="mt-5 space-y-4">
      <div className={styles.control.chipRow}>
        {MODES.map((m) => (
          <button key={m} onClick={() => a.changeMode(m)}><Badge active={a.mode === m}>{t.modes[m]}</Badge></button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {a.mode === "ask" && (
          <label className={`${styles.text.small} flex items-center gap-2`}>
            {t.docPickerLabel}
            <select value={a.docSlug} onChange={(e) => a.setDocSlug(e.target.value)} className={styles.chat.select}>
              <option value="">{t.docPickerNone}</option>
              {docs.map((d) => <option key={d.slug} value={d.slug}>{d.code} · {d.title}</option>)}
            </select>
          </label>
        )}
        <label className={`${styles.text.small} flex items-center gap-2`}>
          {t.passwordLabel}
          <Input type="password" value={a.password} onChange={(e) => a.setPassword(e.target.value)} className="w-40" autoComplete="off" />
        </label>
        <Muted size="xs">{t.passwordHint}</Muted>
      </div>

      <div className={styles.chat.log}>
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
