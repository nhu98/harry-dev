/**
 * Study roadmap, copied from the schedules in E12 §0, §10.10, §13.4 (class nights Mon/Thu)
 * and E13 §13 (speaking nights Tue/Wed). Change a date here when the plan moves.
 */
import type { Lesson } from "./types";
import { E12, E13, TOPIC_SETS } from "./sets";

const cls = (id: string, date: string, title: string, heading: string, sets: string[]): Lesson => ({ id, date, kind: "class", title, source: { slug: E12, heading }, sets });

const CLASS_LESSONS: Lesson[] = [
  cls("c-1022a", "2026-10-22", "Hiện tại đơn + hiện tại tiếp diễn", "1. Hiện tại đơn — Present Simple", ["tenses"]),
  cls("c-1022b", "2026-10-22", "Lỗi dịch từ tiếng Việt", "10.5 Nhóm 4 — Dịch từng chữ từ tiếng Việt", ["fix-vn"]),
  cls("c-1026a", "2026-10-26", "Quá khứ đơn + bất quy tắc nhóm A, B", "2. Quá khứ đơn — Past Simple", ["irregular"]),
  cls("c-1026b", "2026-10-26", "Giới từ đi kèm", "10.2 Nhóm 1 — Giới từ đi kèm (học theo cụm)", ["fix-prep"]),
  cls("c-1029a", "2026-10-29", "Tương lai + bất quy tắc nhóm C, D", "3. Tương lai đơn — Future Simple (will / going to)", ["irregular"]),
  cls("c-1029b", "2026-10-29", "Giới từ nơi chốn + dạng từ", "10.4 Nhóm 3 — Dạng từ (word form)", ["fix-words"]),
  cls("c-1102a", "2026-11-02", "Hiện tại hoàn thành + so sánh các thì", "5. Hiện tại hoàn thành — Present Perfect", ["tenses"]),
  cls("c-1102b", "2026-11-02", "Cặp từ gần nghĩa + đại từ phản thân", "10.6 Nhóm 5 — Cặp từ nghĩa gần", ["fix-words"]),
  cls("c-1105a", "2026-11-05", "Làm hết bài tập 5 thì, nói to câu mẫu", "8. Bài tập tổng hợp + đáp án", ["tenses"]),
  cls("c-1105b", "2026-11-05", "Từ vựng, cụm từ hay", "10.8 Nhóm 7 — Từ vựng, cụm từ hay (nạp Anki)", []),
  cls("c-1109", "2026-11-09", "Article + Uncountable nouns", "11.1 Article — a / an / the / không mạo từ", ["article", "uncountable"]),
  cls("c-1112", "2026-11-12", "Preposition", "11.2 Preposition — in / on / at và hơn thế", ["preposition"]),
  cls("c-1116", "2026-11-16", "Parts of speech + Adverb", "11.4 Parts of speech — từ loại và đuôi từ", ["wordform"]),
  cls("c-1119", "2026-11-19", "Passive voice", "11.5 Passive voice — câu bị động", ["passive"]),
  cls("c-1123", "2026-11-23", "Từ cảm xúc + tính cách", "13. Từ vựng cảm xúc và tính cách", []),
];

/** One topic per Tue/Wed evening, in E13 order. */
const SPEAK_DATES = ["2026-10-27", "2026-10-28", "2026-11-03", "2026-11-04", "2026-11-10", "2026-11-11", "2026-11-17", "2026-11-18", "2026-11-24", "2026-11-25", "2026-12-01", "2026-12-02"];

const SPEAK_LESSONS: Lesson[] = TOPIC_SETS.slice(0, SPEAK_DATES.length).map((t, i) => ({
  id: `s-topic-${t.n}`,
  date: SPEAK_DATES[i],
  kind: "speak",
  title: t.title,
  source: { slug: E13, heading: t.heading },
  sets: [`topic-${t.n}`],
}));

export const LESSONS: Lesson[] = [...CLASS_LESSONS, ...SPEAK_LESSONS].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
