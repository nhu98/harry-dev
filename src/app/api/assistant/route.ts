import { NextResponse } from "next/server";
import { errorCode, runAssistant } from "@/features/assistant/service";
import type { AssistantRequest } from "@/features/assistant/types";

/** No password: the site is single-user. Abuse protection = same-origin check + per-IP rate limit. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  h.count++;
  return h.count > MAX_PER_WINDOW;
}

function sameOrigin(req: Request): boolean {
  const host = req.headers.get("host") ?? "";
  const from = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  if (!host) return true; // local/dev
  try { return new URL(from).host === host; } catch { return false; }
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no_key" }, { status: 500 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "auth" }, { status: 403 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anon";
  if (rateLimited(ip)) return NextResponse.json({ error: "quota" }, { status: 429 });

  let body: AssistantRequest;
  try { body = (await req.json()) as AssistantRequest; } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (!body?.mode || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    return NextResponse.json(await runAssistant(body, apiKey));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errorCode(e) }, { status: 502 });
  }
}
