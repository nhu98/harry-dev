"use client";
import { useState } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, Button, Card, Muted, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { PHRASE_GROUPS } from "../phrases";
import { useDeck } from "../useDeck";

export function Flashcards() {
  const [groupIndex, setGroupIndex] = useState(0);
  const group = PHRASE_GROUPS[groupIndex];
  const deck = useDeck(group.items.length);
  const card = group.items[deck.current];
  const t = STRINGS.phrases;

  return (
    <div className="mt-5 space-y-4">
      <div className={styles.control.chipRow}>
        {PHRASE_GROUPS.map((g, k) => (
          <button key={g.title} onClick={() => { setGroupIndex(k); deck.reset(); }}>
            <Badge active={k === groupIndex}>{g.title}</Badge>
          </button>
        ))}
      </div>
      <Muted size="xs">{group.hint}</Muted>

      <button onClick={deck.flip} className="w-full text-left">
        <Card className={styles.flashcard}>
          <span className={`${styles.text.tiny} mb-2`}>{deck.flipped ? t.sideVi : t.sideEn} · {deck.position + 1}/{group.items.length}</span>
          <span className={cn("text-xl leading-snug", !deck.flipped && "font-medium")}>{deck.flipped ? card.vi : card.en}</span>
          {!deck.flipped && <span className={`${styles.text.tiny} mt-4`}>{STRINGS.common.tapToFlip}</span>}
        </Card>
      </button>

      <div className={styles.control.buttonRow}>
        <Button variant="outline" className="flex-1" onClick={() => deck.go(-1)}>{STRINGS.common.prev}</Button>
        <Button className="flex-1" onClick={() => deck.go(1)}>{STRINGS.common.next}</Button>
        <Button variant="outline" className={cn(deck.shuffled && styles.state.activeOutline)} onClick={deck.toggleShuffle}>{t.shuffle}</Button>
      </div>

      <details className="text-sm">
        <summary className={`cursor-pointer ${styles.text.muted}`}>{STRINGS.common.viewAll}</summary>
        <ul className="mt-2 space-y-2">
          {group.items.map((p) => (
            <Card as="li" key={p.en} padded={false} className="px-3 py-2">
              <div className="font-medium">{p.en}</div>
              <div className={styles.text.muted}>{p.vi}</div>
            </Card>
          ))}
        </ul>
      </details>
    </div>
  );
}
