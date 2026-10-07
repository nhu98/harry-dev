import { NextResponse } from "next/server";
import { errorCode, runAssistant } from "@/features/assistant/service";
import type { AssistantRequest } from "@/features/assistant/types";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const password = process.env.ASSISTANT_PASSWORD;
  if (!apiKey) return NextResponse.json({ error: "no_key" }, { status: 500 });
  if (password && req.headers.get("x-assistant-password") !== password) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
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
