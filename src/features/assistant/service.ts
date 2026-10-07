/** Server-side orchestration for /api/assistant. Keeps the route handler thin. */
import { loadAll } from "@/features/docs/lib/repository";
import { generateImage, generateText } from "./lib/gemini";
import { DOC_CONTEXT_LIMIT, MODELS, SYSTEM } from "./prompts";
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
    const out = await generateImage({ model: MODELS.image, prompt, apiKey });
    return { text: out.text, imageDataUrl: out.imageDataUrl };
  }
  const system = SYSTEM[req.mode] + docContext(req.docSlug);
  const text = await generateText({ model: MODELS.text, system, messages, apiKey });
  return { text };
}
