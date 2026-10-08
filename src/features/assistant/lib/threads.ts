/** Pure functions for the persisted assistant state: parse, validate, prune. No React, no storage here. */
import { SITE } from "@/config/site";
import { MODES, type Message, type Mode, type Thread } from "../types";

export type State = { activeId: string | null; mode: Mode; docSlug: string; threads: Thread[] };
export const emptyState: State = { activeId: null, mode: "ask", docSlug: "", threads: [] };

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_BYTES = 3_000_000; // stay well below the ~5MB localStorage quota
const TITLE_LEN = 48;

const isMode = (m: unknown): m is Mode => MODES.includes(m as Mode);
const isMessage = (m: unknown): m is Message =>
  typeof m === "object" && m !== null && ((m as Message).role === "user" || (m as Message).role === "model") && typeof (m as Message).text === "string";
const isThread = (t: unknown): t is Thread => {
  const x = t as Thread;
  return typeof x === "object" && x !== null && typeof x.id === "string" && isMode(x.mode) && typeof x.title === "string"
    && typeof x.createdAt === "number" && typeof x.updatedAt === "number" && Array.isArray(x.messages) && x.messages.every(isMessage);
};

export function parseState(raw: string): State {
  if (!raw) return emptyState;
  try {
    const s = JSON.parse(raw) as Partial<State>;
    const threads = Array.isArray(s.threads) ? s.threads.filter(isThread) : [];
    return {
      activeId: typeof s.activeId === "string" && threads.some((t) => t.id === s.activeId) ? s.activeId : null,
      mode: isMode(s.mode) ? s.mode : "ask",
      docSlug: typeof s.docSlug === "string" ? s.docSlug : "",
      threads,
    };
  } catch {
    return emptyState;
  }
}

/** Periodic cleanup: drop old threads, cap count, cap messages per thread, cap total size. Newest first. */
export function pruneState(s: State, now: number): State {
  const { maxThreads, maxAgeDays, maxMessages } = SITE.assistant;
  let threads = s.threads
    .filter((t) => now - t.updatedAt <= maxAgeDays * DAY_MS)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, maxThreads)
    .map((t) => (t.messages.length > maxMessages ? { ...t, messages: t.messages.slice(-maxMessages) } : t));
  while (threads.length > 1 && JSON.stringify(threads).length > MAX_BYTES) threads = threads.slice(0, -1);
  return { ...s, threads, activeId: threads.some((t) => t.id === s.activeId) ? s.activeId : null };
}

export function upsertThread(s: State, thread: Thread): State {
  const exists = s.threads.some((t) => t.id === thread.id);
  const threads = exists ? s.threads.map((t) => (t.id === thread.id ? thread : t)) : [thread, ...s.threads];
  return { ...s, threads, activeId: thread.id };
}

export function titleFrom(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > TITLE_LEN ? `${flat.slice(0, TITLE_LEN)}…` : flat;
}

export function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
