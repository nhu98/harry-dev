/** Thin wrapper over the Gemini REST API. Server-only. No SDK, one fetch. */
import type { Message } from "../types";
import { ATTEMPT_TIMEOUT_MS, type TextModel } from "../prompts";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type Part = { text?: string };

export class GeminiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Statuses worth retrying with the next model: missing model, quota, overloaded. */
export const RETRYABLE = new Set([404, 429, 503, 504]);

export async function generateText(opts: { model: TextModel; system: string; messages: Message[]; apiKey: string }) {
  let res: Response;
  try {
    res = await fetch(`${BASE}/${opts.model.id}:generateContent?key=${opts.apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: opts.messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] as Part[] })),
        generationConfig: { thinkingConfig: opts.model.thinking },
      }),
    });
  } catch (e) {
    // Timeout or network error: treat as retryable so the next model gets a turn.
    throw new GeminiError(504, `Gemini ${opts.model.id} timeout/network: ${String(e).slice(0, 120)}`);
  }
  if (!res.ok) throw new GeminiError(res.status, `Gemini ${opts.model.id} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
  return (json.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
}
