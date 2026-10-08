/** Thin wrapper over the Gemini REST API. Server-only. No SDK, one fetch. */
import type { Message } from "../types";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type Part = { text?: string };

export class GeminiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Statuses worth retrying with the next model: missing model, quota, overloaded. */
export const RETRYABLE = new Set([404, 429, 503]);

export async function generateText(opts: { model: string; system: string; messages: Message[]; apiKey: string }) {
  const res = await fetch(`${BASE}/${opts.model}:generateContent?key=${opts.apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] as Part[] })),
    }),
  });
  if (!res.ok) throw new GeminiError(res.status, `Gemini ${opts.model} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
  return (json.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
}
