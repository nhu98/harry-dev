/** Server-side orchestration for /api/assistant. Keeps the route handler thin. */
import { loadAll } from "@/features/docs/lib/repository";
import { GeminiError, RETRYABLE, generateImage, generateText } from "./lib/gemini";
import { DOC_CONTEXT_LIMIT, IMAGE_MODEL, SYSTEM, TEXT_MODELS } from "./prompts";
import type { AssistantRequest, AssistantResponse } from "./types";

const MAX_HISTORY = 20;

function docContext(slug?: string): string {
  if (!slug) return "";
  const doc = loadAll().find((d) => d.meta.slug === slug);
  if (!doc) return "";
  return `\n\n[TÀI LIỆU ĐÍNH KÈM: ${doc.meta.title}]\n${doc.body.slice(0, DOC_CONTEXT_LIMIT)}`;
}

export async function runAssistant(req: AssistantRequest, apiKey: string): Promise<AssistantResponse> {
  const messages = req.messages.slice(-MAX_HISTORY);
  if (req.mode === "image") {
    const prompt = messages.at(-1)?.text ?? "";
    const out = await generateImage({ model: IMAGE_MODEL, prompt, apiKey });
    return { text: out.text, imageDataUrl: out.imageDataUrl };
  }
  const system = SYSTEM[req.mode] + docContext(req.docSlug);
  let lastError: unknown;
  for (const model of TEXT_MODELS) {
    try {
      return { text: await generateText({ model, system, messages, apiKey }) };
    } catch (e) {
      lastError = e;
      if (!(e instanceof GeminiError) || !RETRYABLE.has(e.status)) throw e;
    }
  }
  throw lastError;
}

/** Map an upstream failure to a short error code the client can explain. */
export function errorCode(e: unknown): "quota" | "busy" | "upstream" {
  if (e instanceof GeminiError) {
    if (e.status === 429) return "quota";
    if (e.status === 503) return "busy";
  }
  return "upstream";
}
