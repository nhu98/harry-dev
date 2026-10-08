"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SITE } from "@/config/site";
import { createLocalStore } from "@/shared/lib/storage";
import { makeId, parseState, pruneState, titleFrom, upsertThread, type State } from "./lib/threads";
import type { AssistantResponse, Mode, Thread } from "./types";

type ErrorCode = "no_key" | "auth" | "quota" | "busy" | "generic";
const KNOWN_ERRORS: readonly string[] = ["no_key", "auth", "quota", "busy"];

const store = createLocalStore("harry-assistant-v2");

/** Threads persisted in localStorage; one hook shared by the floating bubble and the full page. */
export function useAssistant() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const state = useMemo(() => parseState(raw), [raw]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const commit = (next: State) => store.set(pruneState(next, Date.now()));
  const active = state.threads.find((t) => t.id === state.activeId) ?? null;

  const changeMode = (mode: Mode) => {
    if (mode === state.mode) return;
    commit({ ...state, mode, activeId: null });
    setError(null);
  };

  const setDocSlug = (docSlug: string) => {
    const threads = active && active.mode === "ask"
      ? state.threads.map((t) => (t.id === active.id ? { ...t, docSlug: docSlug || undefined } : t))
      : state.threads;
    commit({ ...state, docSlug, threads });
  };

  const newChat = () => { commit({ ...state, activeId: null }); setError(null); };

  const openThread = (id: string) => {
    const t = state.threads.find((x) => x.id === id);
    if (!t) return;
    commit({ ...state, activeId: id, mode: t.mode, docSlug: t.docSlug ?? "" });
    setError(null);
  };

  const deleteThread = (id: string) => commit({ ...state, threads: state.threads.filter((t) => t.id !== id), activeId: state.activeId === id ? null : state.activeId });
  const clearAll = () => commit({ ...state, threads: [], activeId: null });

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const now = Date.now();
    const base: Thread = active ?? { id: makeId(), mode: state.mode, title: titleFrom(t), createdAt: now, updatedAt: now, docSlug: state.mode === "ask" && state.docSlug ? state.docSlug : undefined, messages: [] };
    const withUser: Thread = { ...base, updatedAt: now, messages: [...base.messages, { role: "user", text: t }] };
    commit(upsertThread(state, withUser));
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SITE.routes.assistantApi, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: base.mode, messages: withUser.messages, docSlug: base.mode === "ask" ? base.docSlug : undefined }),
      });
      const data = (await res.json()) as AssistantResponse;
      if (!res.ok) {
        setError(KNOWN_ERRORS.includes(data.error ?? "") ? (data.error as ErrorCode) : "generic");
        return;
      }
      const latest = parseState(store.getSnapshot());
      const current = latest.threads.find((x) => x.id === withUser.id);
      if (!current) return; // deleted while waiting
      const reply: Thread = { ...current, updatedAt: Date.now(), messages: [...current.messages, { role: "model", text: data.text ?? "" }] };
      commit({ ...latest, threads: latest.threads.map((x) => (x.id === reply.id ? reply : x)) });
    } catch {
      setError("generic");
    } finally {
      setLoading(false);
    }
  };

  return {
    mode: state.mode, changeMode,
    docSlug: state.docSlug, setDocSlug,
    threads: state.threads, activeId: state.activeId,
    messages: active?.messages ?? [],
    send, newChat, openThread, deleteThread, clearAll,
    loading, error,
  };
}
