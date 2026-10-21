/** Pure quiz logic: answer checking, run preparation, spaced repetition. No React, no storage. */
import { slug } from "github-slugger";
import { addDays, toDateKey } from "@/shared/lib/date";
import { SITE } from "@/config/site";
import type { DocRef, PracticeState, QState, Question } from "../types";

/** Days until a question returns, indexed by Leitner box (box 0 = wrong, due again today). */
const INTERVALS = [0, 1, 3, 7, 14];
export const MASTERED_BOX = 3;
const MAX_ATTEMPTS_KEPT = 20;
const MAX_DAYS_KEPT = 120;

export const EMPTY_STATE: PracticeState = { q: {}, attempts: {}, lessons: {}, days: [] };

export function docHref(ref: DocRef): string {
  return `${SITE.routes.docs(ref.slug)}#${slug(ref.heading)}`;
}

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[’‘`]/g, "'").replace(/'/g, "").replace(/[.,!?;:/\-–()]/g, " ").replace(/\s+/g, " ").trim();
}

export function isCorrect(q: Question, answer: string | number): boolean {
  if (q.kind === "choice") return answer === q.answer;
  const a = normalize(String(answer));
  return q.accept.some((x) => normalize(x) === a);
}

export function correctText(q: Question): string {
  return q.kind === "choice" ? q.options[q.answer] : q.accept[0];
}

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Random order, optional subset, and shuffled options (answer index remapped). Call from an event handler. */
export function prepareRun(questions: Question[], pick: number | undefined, rand: () => number): Question[] {
  const chosen = shuffle(questions, rand).slice(0, pick ?? questions.length);
  return chosen.map((q) => {
    if (q.kind !== "choice") return q;
    const order = shuffle(q.options.map((_, i) => i), rand);
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
  });
}

export function nextQState(prev: QState | undefined, correct: boolean, today: Date): QState {
  const box = correct ? Math.min((prev?.box ?? 0) + 1, INTERVALS.length - 1) : 0;
  return {
    box,
    due: toDateKey(addDays(today, INTERVALS[box])),
    wrong: (prev?.wrong ?? 0) + (correct ? 0 : 1),
    seen: (prev?.seen ?? 0) + 1,
  };
}

export type RunResult = { id: string; correct: boolean };

export function applyRun(state: PracticeState, setId: string, results: RunResult[], now: Date): PracticeState {
  const today = toDateKey(now);
  const q = { ...state.q };
  for (const r of results) q[r.id] = nextQState(q[r.id], r.correct, now);
  const score = results.filter((r) => r.correct).length;
  const prev = state.attempts[setId] ?? [];
  const attempts = { ...state.attempts, [setId]: [...prev, { d: today, s: score, t: results.length }].slice(-MAX_ATTEMPTS_KEPT) };
  const days = state.days.includes(today) ? state.days : [...state.days, today].slice(-MAX_DAYS_KEPT);
  return { ...state, q, attempts, days };
}

/** Questions answered wrong before and due again today or earlier. */
export function dueMistakes(state: PracticeState, all: Question[], today: string): Question[] {
  return all.filter((x) => {
    const s = state.q[x.id];
    return s && s.wrong > 0 && s.box < MASTERED_BOX && s.due <= today;
  });
}

export function practiceStreak(days: string[], now: Date): number {
  const set = new Set(days);
  let n = 0;
  let d = now;
  if (!set.has(toDateKey(d))) d = addDays(d, -1);
  for (; set.has(toDateKey(d)); d = addDays(d, -1)) n++;
  return n;
}

export function bestPercent(state: PracticeState, setId: string): number | null {
  const list = state.attempts[setId];
  if (!list?.length) return null;
  return Math.max(...list.map((a) => Math.round((a.s / a.t) * 100)));
}

/** Lessons due today or earlier that are not ticked, oldest first. */
export function pendingLessons<L extends { id: string; date: string }>(lessons: L[], state: PracticeState, today: string, max: number): L[] {
  return lessons.filter((l) => !state.lessons[l.id] && l.date <= today).slice(0, max);
}

export function nextLesson<L extends { id: string; date: string }>(lessons: L[], state: PracticeState, today: string): L | undefined {
  return lessons.find((l) => !state.lessons[l.id] && l.date > today);
}

export function countMastered(state: PracticeState, all: Question[]): number {
  return all.filter((x) => (state.q[x.id]?.box ?? 0) >= MASTERED_BOX).length;
}

export function countWrongNow(state: PracticeState): number {
  return Object.values(state.q).filter((s) => s.wrong > 0 && s.box < MASTERED_BOX).length;
}
