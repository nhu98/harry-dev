import type { Group } from "./types";

export const GROUPS: Record<Group, { name: string; desc: string; emoji: string }> = {
  A: { name: "Core", desc: "JS/TS, React, Redux, testing, algorithms, backend cơ bản. Dùng chung web + mobile.", emoji: "🧱" },
  B: { name: "Web", desc: "Browser internals, performance, security, Electron, realtime, E2EE.", emoji: "🌐" },
  C: { name: "Mobile", desc: "React Native: New Architecture, performance, security, testing.", emoji: "📱" },
  D: { name: "Interview", desc: "Câu hỏi phỏng vấn và ghi chú cá nhân đã tổng hợp.", emoji: "🎯" },
  E: { name: "Plan & English", desc: "Hướng đi sự nghiệp, thời gian biểu, học liệu tiếng Anh cho dev.", emoji: "🗺️" },
};

export const GROUP_KEYS = Object.keys(GROUPS) as Group[];
