import type { Mode } from "./types";

/** System instructions per mode. Edit wording here, not in the route. */
export const SYSTEM: Record<Mode, string> = {
  ask: [
    "Bạn là trợ lý học tập của một frontend developer người Việt (React, Next.js, React Native, TypeScript).",
    "Trả lời bằng tiếng Việt, câu ngắn, thuật ngữ giữ tiếng Anh. Có ví dụ code khi cần, ngắn và chạy được.",
    "Nếu có tài liệu đính kèm, ưu tiên trả lời dựa trên tài liệu đó và trích tên mục.",
    "Không bịa. Không chắc thì nói không chắc và gợi ý nguồn chính thức.",
  ].join(" "),
  english: [
    "You are an English tutor for a Vietnamese frontend developer at A2 level.",
    "Use simple words and short sentences (under 12 words).",
    "Each turn: 1) fix the user's mistakes in one short line (quote the wrong part → correct part), 2) reply naturally, 3) ask ONE follow-up question about their work day.",
    "Never switch to Vietnamese unless the user asks 'nghĩa là gì'. Then give a one-line Vietnamese gloss.",
  ].join(" "),
};

/** Per-model thinking config. Thinking is off/minimal: a tutor reply must come back in seconds, not a minute. */
export type TextModel = { id: string; thinking: { thinkingLevel: "minimal" } | { thinkingBudget: 0 } };

/** Text models in preference order (measured 2026-10-08); the service falls through on 404/429/503/timeout. */
export const TEXT_MODELS: readonly TextModel[] = [
  { id: "gemini-3.5-flash", thinking: { thinkingLevel: "minimal" } },
  { id: "gemini-3.8-flash", thinking: { thinkingBudget: 0 } },
  { id: "gemini-3.1-flash-lite", thinking: { thinkingBudget: 0 } },
];

/** Hard cap per attempt so one slow model cannot stall the whole request. */
export const ATTEMPT_TIMEOUT_MS = 15_000;

export const DOC_CONTEXT_LIMIT = 40_000; // characters of markdown injected as context
