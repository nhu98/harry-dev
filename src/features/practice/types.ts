/** A question answered by tapping one option. `answer` is the index in `options`. */
export type ChoiceQ = { kind: "choice"; id: string; prompt: string; options: string[]; answer: number; explain?: string };
/** A question answered by typing. Any string in `accept` counts (compared after normalize). */
export type TypedQ = { kind: "typed"; id: string; prompt: string; accept: string[]; explain?: string };
export type Question = ChoiceQ | TypedQ;

export type DocRef = { slug: string; heading: string };

/** A practice set. `pick` limits how many questions one run uses (random subset). */
export type QuizSet = { id: string; title: string; source: DocRef; questions: Question[]; pick?: number };

export type LessonKind = "class" | "speak";
export type Lesson = { id: string; date: string; kind: LessonKind; title: string; source: DocRef; sets: string[] };

/** Leitner box per question: higher box = longer gap before it comes back. */
export type QState = { box: number; due: string; wrong: number; seen: number };
export type Attempt = { d: string; s: number; t: number };
export type PracticeState = {
  q: Record<string, QState>;
  attempts: Record<string, Attempt[]>;
  lessons: Record<string, string>;
  days: string[];
};

export type Generated = {
  verbs: { v1: string; star: boolean; v2: string[]; v3: string[]; vi: string }[];
  topics: { n: number; title: string; heading: string; words: { en: string; vi: string }[] }[];
};
