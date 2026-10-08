/** Server-side orchestration for /api/assistant. Keeps the route handler thin. */
import { loadAll } from "@/features/docs/lib/repository";
import { searchSections } from "@/features/docs/lib/search";
import { GeminiError, RETRYABLE, generateText } from "./lib/gemini";
import { DOC_CONTEXT_LIMIT, SYSTEM, TEXT_MODELS } from "./prompts";
import type { AssistantRequest, AssistantResponse } from "./types";

const MAX_HISTORY = 20;
const RETRIEVE_SECTIONS = 6;

/** One doc when the user picked it; otherwise the best-matching sections across the whole knowledge base. */
function docContext(question: string, slug?: string): string {
  if (slug) {
    const doc = loadAll().find((d) => d.meta.slug === slug);
    return doc ? `\n\n[TÀI LIỆU ĐÍNH KÈM: ${doc.meta.title}]\n${doc.body.slice(0, DOC_CONTEXT_LIMIT)}` : "";
  }
  const hits = searchSections(question, { limit: RETRIEVE_SECTIONS, maxChars: DOC_CONTEXT_LIMIT });
  if (hits.length === 0) return "";
  return "\n\n[TRÍCH TỪ KHO TÀI LIỆU CỦA HARRY — ưu tiên dùng, nêu tên mục khi trích]\n" +
    hits.map((h) => `--- ${h.docTitle} › ${h.heading}\n${h.text}`).join("\n\n");
}

export async function runAssistant(req: AssistantRequest, apiKey: string): Promise<AssistantResponse> {
  const messages = req.messages.slice(-MAX_HISTORY);
  const question = messages.filter((m) => m.role === "user").map((m) => m.text).slice(-2).join(" ");
  const system = SYSTEM[req.mode] + (req.mode === "ask" ? docContext(question, req.docSlug) : "");
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
    if (e.status === 503 || e.status === 504) return "busy";
  }
  return "upstream";
}
