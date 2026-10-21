/**
 * All quiz sets: hand-written ones (questions.ts) + generated ones (generated.json,
 * built from E12 §7 irregular verbs and E13 ⭐ vocab tables by scripts/build-practice.mjs).
 */
import type { ChoiceQ, DocRef, Generated, Question, QuizSet, TypedQ } from "./types";
import data from "./generated.json";
import { ARTICLE, FIX_PREP, FIX_VN, FIX_WORDS, PASSIVE, PREPOSITION, TENSES, UNCOUNTABLE, WORDFORM } from "./questions";

const GEN = data as Generated;
export const E12 = "e12-on-tap-lop-giao-tiep";
export const E13 = "e13-tu-vung-theo-chu-de";
const DISTRACTOR_OFFSETS = [1, 5, 9];
const PICK = 10;

const ref = (slug: string, heading: string): DocRef => ({ slug, heading });
const idPart = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function verbQuestions(): TypedQ[] {
  return GEN.verbs.map((v) => ({
    kind: "typed",
    id: `irr-${idPart(v.v1)}`,
    prompt: `${v.v1} (${v.vi}) → V2 V3 ?`,
    accept: v.v2.flatMap((a) => v.v3.map((b) => `${a} ${b}`)),
    explain: `${v.v1} – ${v.v2.join(" / ")} – ${v.v3.join(" / ")}`,
  }));
}

function topicQuestions(words: Generated["topics"][number]["words"], n: number): ChoiceQ[] {
  return words.map((w, i) => {
    const wrong = DISTRACTOR_OFFSETS.map((o) => words[(i + o) % words.length].vi).filter((x) => x !== w.vi);
    return { kind: "choice", id: `topic-${n}-${idPart(w.en)}`, prompt: `"${w.en}" nghĩa là gì?`, options: [w.vi, ...new Set(wrong)], answer: 0 };
  });
}

const HAND: QuizSet[] = [
  { id: "tenses", title: "5 thì", source: ref(E12, "8. Bài tập tổng hợp + đáp án"), questions: TENSES, pick: PICK },
  { id: "irregular", title: "Động từ bất quy tắc", source: ref(E12, "7. Bảng động từ bất quy tắc"), questions: verbQuestions(), pick: PICK },
  { id: "fix-vn", title: "Lỗi dịch từ tiếng Việt", source: ref(E12, "10.5 Nhóm 4 — Dịch từng chữ từ tiếng Việt"), questions: FIX_VN },
  { id: "fix-prep", title: "Giới từ đi kèm", source: ref(E12, "10.2 Nhóm 1 — Giới từ đi kèm (học theo cụm)"), questions: FIX_PREP, pick: PICK },
  { id: "fix-words", title: "Dạng từ + cặp từ dễ nhầm", source: ref(E12, "10.4 Nhóm 3 — Dạng từ (word form)"), questions: FIX_WORDS, pick: PICK },
  { id: "article", title: "Article a / an / the", source: ref(E12, "11.1 Article — a / an / the / không mạo từ"), questions: ARTICLE },
  { id: "preposition", title: "Preposition in / on / at", source: ref(E12, "11.2 Preposition — in / on / at và hơn thế"), questions: PREPOSITION, pick: PICK },
  { id: "uncountable", title: "Uncountable nouns", source: ref(E12, "11.3 Uncountable nouns — danh từ không đếm được"), questions: UNCOUNTABLE },
  { id: "wordform", title: "Parts of speech + Adverb", source: ref(E12, "11.4 Parts of speech — từ loại và đuôi từ"), questions: WORDFORM },
  { id: "passive", title: "Passive voice", source: ref(E12, "11.5 Passive voice — câu bị động"), questions: PASSIVE },
];

const TOPICS: QuizSet[] = GEN.topics.map((t) => ({
  id: `topic-${t.n}`,
  title: `Từ vựng: ${t.title}`,
  source: ref(E13, t.heading),
  questions: topicQuestions(t.words, t.n),
}));

export const SETS: QuizSet[] = [...HAND, ...TOPICS];
export const TOPIC_SETS = GEN.topics.map((t) => ({ n: t.n, title: t.title, heading: t.heading, words: t.words.map((w) => w.en) }));

export const ALL_QUESTIONS: Question[] = SETS.flatMap((s) => s.questions);
