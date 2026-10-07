export type Task = { id: string; label: string; time: string; min?: boolean };

// Mirrors the 🔴 (minimum) and normal items in E5. Minimum items are enough on a lazy day.
export const TASKS: Task[] = [
  { id: "listen-am", label: "Bật loa 1 tập BBC 6 Minute English khi sửa soạn", time: "8h00" },
  { id: "product-3-lines", label: "3 dòng Product trước task đầu tiên (user goal / simpler way / 1 câu hỏi cho PO)", time: "Sáng", min: true },
  { id: "nap", label: "Power nap 20 phút", time: "13h00", min: true },
  { id: "vocab", label: "Mochi 20p + Anki tech 10p", time: "13h30", min: true },
  { id: "video", label: "1 video tech 3 lần + thì thầm 5 câu (tai nghe)", time: "14h00", min: true },
  { id: "pe-block", label: "Khối Product Engineer: 1 endpoint backend với AI gia sư / brag doc", time: "14h45", min: true },
  { id: "chat-ai", label: "Chat gõ chữ với AI bằng EN 1 đề", time: "15h30" },
  { id: "diary", label: "Standup diary 3 câu EN", time: "17h35", min: true },
  { id: "speak", label: "20 phút NÓI (voice với AI / chuẩn bị lớp)", time: "19h40", min: true },
  { id: "lights", label: "Tắt đèn trước 24h", time: "23h30", min: true },
];
