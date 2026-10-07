"use client";
import { useState } from "react";
import { SITE } from "@/config/site";
import { readJson, writeJson } from "@/shared/lib/storage";
import type { AssistantResponse, Message, Mode } from "./types";

const PASSWORD_KEY = "harry-assistant-password";

export function useAssistant() {
  const [mode, setMode] = useState<Mode>("ask");
  const [docSlug, setDocSlug] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [password, setPasswordState] = useState<string>(() => readJson<string>(PASSWORD_KEY, ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"no_key" | "auth" | "quota" | "busy" | "generic" | null>(null);

  const setPassword = (p: string) => { setPasswordState(p); writeJson(PASSWORD_KEY, p); };
  const changeMode = (m: Mode) => { setMode(m); setMessages([]); setError(null); };
  const clear = () => { setMessages([]); setError(null); };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...messages, { role: "user" as const, text: t }];
    setMessages(next);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SITE.routes.assistantApi, {
        method: "POST",
        headers: { "content-type": "application/json", "x-assistant-password": password },
        body: JSON.stringify({ mode, messages: next, docSlug: mode === "ask" && docSlug ? docSlug : undefined }),
      });
      const data = (await res.json()) as AssistantResponse;
      if (!res.ok) {
        const known = ["no_key", "auth", "quota", "busy"] as const;
        setError((known as readonly string[]).includes(data.error ?? "") ? (data.error as (typeof known)[number]) : "generic");
        return;
      }
      setMessages([...next, { role: "model", text: data.text ?? "", imageDataUrl: data.imageDataUrl }]);
    } catch {
      setError("generic");
    } finally {
      setLoading(false);
    }
  };

  return { mode, changeMode, docSlug, setDocSlug, messages, send, clear, loading, error, password, setPassword };
}
