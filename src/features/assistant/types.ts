export const MODES = ["ask", "english"] as const;
export type Mode = (typeof MODES)[number];
export type Role = "user" | "model";
export type Message = { role: Role; text: string };

export type Thread = {
  id: string;
  mode: Mode;
  title: string;
  createdAt: number;
  updatedAt: number;
  docSlug?: string;
  messages: Message[];
};

export type AssistantRequest = { mode: Mode; messages: Message[]; docSlug?: string };
export type AssistantResponse = { text?: string; error?: string };
