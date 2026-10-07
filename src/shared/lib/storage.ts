/**
 * Safe localStorage wrapper + a tiny external store so React components can
 * subscribe via useSyncExternalStore without hydration mismatches.
 */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota: ignore, UI still works for this session */
  }
}

export function createLocalStore(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    /** Raw string snapshot: stable between calls, so React can compare it. */
    getSnapshot() {
      try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
    },
    getServerSnapshot() { return ""; },
    set(value: unknown) {
      writeJson(key, value);
      listeners.forEach((cb) => cb());
    },
  };
}
