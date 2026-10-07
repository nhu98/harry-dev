/** Thin wrapper over the Gemini REST API. Server-only. No SDK, one fetch. */
import type { Message } from "../types";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type Part = { text?: string; inlineData?: { mimeType: string; data: string } };

function toContents(messages: Message[]) {
  return messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] as Part[] }));
}

export class GeminiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Statuses worth retrying with the next model: missing model, quota, overloaded. */
export const RETRYABLE = new Set([404, 429, 503]);

async function call(model: string, body: unknown, apiKey: string) {
  const res = await fetch(`${BASE}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new GeminiError(res.status, `Gemini ${model} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
  return json.candidates?.[0]?.content?.parts ?? [];
}

export async function generateText(opts: { model: string; system: string; messages: Message[]; apiKey: string }) {
  const parts = await call(
    opts.model,
    { systemInstruction: { parts: [{ text: opts.system }] }, contents: toContents(opts.messages) },
    opts.apiKey,
  );
  return parts.map((p) => p.text ?? "").join("").trim();
}

export async function generateImage(opts: { model: string; prompt: string; apiKey: string }) {
  const parts = await call(
    opts.model,
    { contents: [{ role: "user", parts: [{ text: opts.prompt }] }], generationConfig: { responseModalities: ["IMAGE", "TEXT"] } },
    opts.apiKey,
  );
  const img = parts.find((p) => p.inlineData);
  const text = parts.map((p) => p.text ?? "").join("").trim();
  return { imageDataUrl: img ? `data:${img.inlineData!.mimeType};base64,${img.inlineData!.data}` : undefined, text };
}
