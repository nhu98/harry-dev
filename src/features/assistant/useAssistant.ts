"use client";
import { useState, useSyncExternalStore } from "react";
import { SITE } from "@/config/site";
import { createLocalStore } from "@/shared/lib/storage";
import type { AssistantResponse, Message, Mode } from "./types";

/** Conversation state persisted in localStorage; shared by the bubble and the full page. */
type State = { mode: Mode; docSlug: string; threads: Record<Mode, Message[]> };
const EMPTY: State = { mode: "ask", docSlug: "", threads: { ask: [], english: [], image: [] } };
const MAX_MESSAGES = 60;   // per mode
const KEEP_IMAGES = 3;     // base64 images are large; keep only the latest few

const store = createLocalStore("harry-assistant-v1");

function parse(raw: string): State {
  try {
    const s = raw ? (JSON.parse(raw) as Partial<State>) : {};
    return { ...EMPTY, ...s, threads: { ...EMPTY.threads, ...(s.threads ?? {}) } };
  } catch { return EMPTY; }
}

function trim(msgs: Message[]): Message[] {
  const kept = msgs.slice(-MAX_MESSAGES);
  let images = 0;
  for (let i = kept.length - 1; i >= 0; i--) {
    if (kept[i].imageDataUrl && ++images > KEEP_IMAGES) kept[i] = { ...kept[i], imageDataUrl: undefined };
  }
  return kept;
}

export function useAssistant() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const state = parse(raw);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"no_key" | "auth" | "quota" | "busy" | "generic" | null>(null);

  const save = (patch: Partial<State>) => store.set({ ...state, ...patch });
  const messages = state.threads[state.mode];

  const changeMode = (mode: Mode) => { save({ mode }); setError(null); };
  const setDocSlug = (docSlug: string) => save({ docSlug });
  const clear = () => { save({ threads: { ...state.threads, [state.mode]: [] } }); setError(null); };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const mode = state.mode;
    const next = trim([...messages, { role: "user" as const, text: t }]);
    save({ threads: { ...state.threads, [mode]: next } });
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SITE.routes.assistantApi, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, messages: next, docSlug: mode === "ask" && state.docSlug ? state.docSlug : undefined }),
      });
      const data = (await res.json()) as AssistantResponse;
      if (!res.ok) {
        const known = ["no_key", "auth", "quota", "busy"] as const;
        setError((known as readonly string[]).includes(data.error ?? "") ? (data.error as (typeof known)[number]) : "generic");
        return;
      }
      const latest = parse(store.getSnapshot());
      save({ threads: { ...latest.threads, [mode]: trim([...next, { role: "model", text: data.text ?? "", imageDataUrl: data.imageDataUrl }]) } });
    } catch {
      setError("generic");
    } finally {
      setLoading(false);
    }
  };

  return { mode: state.mode, changeMode, docSlug: state.docSlug, setDocSlug, messages, send, clear, loading, error };
}
