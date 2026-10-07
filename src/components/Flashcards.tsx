"use client";
import { useState } from "react";
import { PHRASE_GROUPS } from "@/data/phrases";

export function Flashcards() {
  const [group, setGroup] = useState(0);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[] | null>(null); // null = natural order
  const items = PHRASE_GROUPS[group].items;
  const natural = items.map((_, k) => k);
  const effective = order && order.length === items.length ? order : natural;
  const shuffle = order !== null;
  const toggleShuffle = () => {
    if (order) { setOrder(null); setI(0); return; }
    const idx = [...natural];
    for (let a = idx.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [idx[a], idx[b]] = [idx[b], idx[a]]; }
    setOrder(idx); setI(0);
  };
  const cur = items[effective[i % effective.length]];
  const go = (d: number) => { setI((x) => (x + d + effective.length) % effective.length); setFlipped(false); };

  return (
    <div className="mt-5 space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PHRASE_GROUPS.map((g, k) => (
          <button key={g.title} onClick={() => { setGroup(k); setI(0); setFlipped(false); setOrder(null); }}
            className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap ${k === group ? "bg-accent text-white border-accent" : "border-border bg-card"}`}>
            {g.title}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{PHRASE_GROUPS[group].hint}</p>
      <button onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-44 rounded-xl border border-border bg-card p-6 text-left flex flex-col justify-center shadow-sm active:scale-[0.99] transition">
        <span className="text-xs text-muted mb-2">{flipped ? "🇻🇳 Nghĩa" : "🇬🇧 English"} · {i + 1}/{effective.length}</span>
        <span className={`text-xl leading-snug ${flipped ? "" : "font-medium"}`}>{flipped ? cur.vi : cur.en}</span>
        {!flipped && <span className="text-xs text-muted mt-4">chạm để xem nghĩa</span>}
      </button>
      <div className="flex gap-2">
        <button onClick={() => go(-1)} className="flex-1 py-2 rounded-md border border-border text-sm">← Trước</button>
        <button onClick={() => go(1)} className="flex-1 py-2 rounded-md bg-accent text-white text-sm">Tiếp →</button>
        <button onClick={toggleShuffle} className={`px-3 py-2 rounded-md border text-sm ${shuffle ? "border-accent text-accent" : "border-border"}`}>🔀</button>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted">Xem cả nhóm</summary>
        <ul className="mt-2 space-y-2">
          {items.map((p) => (
            <li key={p.en} className="rounded-md border border-border bg-card px-3 py-2">
              <div className="font-medium">{p.en}</div>
              <div className="text-muted">{p.vi}</div>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
