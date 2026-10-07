"use client";
import { useState } from "react";
import { Badge, Button, Card } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { PHRASE_GROUPS } from "../phrases";
import { useDeck } from "../useDeck";

export function Flashcards() {
  const [groupIndex, setGroupIndex] = useState(0);
  const group = PHRASE_GROUPS[groupIndex];
  const deck = useDeck(group.items.length);
  const card = group.items[deck.current];

  return (
    <div className="mt-5 space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PHRASE_GROUPS.map((g, k) => (
          <button key={g.title} onClick={() => { setGroupIndex(k); deck.reset(); }}>
            <Badge active={k === groupIndex}>{g.title}</Badge>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{group.hint}</p>

      <button onClick={deck.flip} className="w-full text-left">
        <Card className="min-h-44 p-6 flex flex-col justify-center shadow-sm active:scale-[0.99] transition">
          <span className="text-xs text-muted mb-2">{deck.flipped ? "🇻🇳 Nghĩa" : "🇬🇧 English"} · {deck.position + 1}/{group.items.length}</span>
          <span className={cn("text-xl leading-snug", !deck.flipped && "font-medium")}>{deck.flipped ? card.vi : card.en}</span>
          {!deck.flipped && <span className="text-xs text-muted mt-4">chạm để xem nghĩa</span>}
        </Card>
      </button>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => deck.go(-1)}>← Trước</Button>
        <Button className="flex-1" onClick={() => deck.go(1)}>Tiếp →</Button>
        <Button variant="outline" className={cn(deck.shuffled && "border-accent text-accent")} onClick={deck.toggleShuffle}>🔀</Button>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted">Xem cả nhóm</summary>
        <ul className="mt-2 space-y-2">
          {group.items.map((p) => (
            <Card as="li" key={p.en} className="px-3 py-2">
              <div className="font-medium">{p.en}</div>
              <div className="text-muted">{p.vi}</div>
            </Card>
          ))}
        </ul>
      </details>
    </div>
  );
}
