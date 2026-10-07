"use client";
import { useState } from "react";

/** Navigation state for a flashcard deck: index, flip, optional shuffle order. */
export function useDeck(size: number) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[] | null>(null);

  const effective = order && order.length === size ? order : Array.from({ length: size }, (_, k) => k);
  const reset = () => { setIndex(0); setFlipped(false); setOrder(null); };
  const go = (delta: number) => { setIndex((i) => (i + delta + size) % size); setFlipped(false); };
  const toggleShuffle = () => {
    if (order) { setOrder(null); setIndex(0); return; }
    const idx = [...effective];
    for (let a = idx.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [idx[a], idx[b]] = [idx[b], idx[a]]; }
    setOrder(idx); setIndex(0);
  };

  return { position: index, current: effective[index % size], flipped, flip: () => setFlipped((f) => !f), shuffled: order !== null, go, toggleShuffle, reset };
}
