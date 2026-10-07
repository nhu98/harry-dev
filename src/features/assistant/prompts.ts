import type { Mode } from "./types";

/** System instructions per mode. Edit wording here, not in the route. */
export const SYSTEM: Record<Exclude<Mode, "image">, string> = {
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

/** Text models in preference order; the service falls through on 404/429/503. */
export const TEXT_MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"] as const;
/** Image generation needs a billed Gemini API project (free tier quota is 0). */
export const IMAGE_MODEL = "gemini-3.1-flash-image";

export const DOC_CONTEXT_LIMIT = 40_000; // characters of markdown injected as context
