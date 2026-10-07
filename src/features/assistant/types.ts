export type Mode = "ask" | "english" | "image";
export type Role = "user" | "model";
export type Message = { role: Role; text: string; imageDataUrl?: string };

export type AssistantRequest = { mode: Mode; messages: Message[]; docSlug?: string };
export type AssistantResponse = { text?: string; imageDataUrl?: string; error?: string };
