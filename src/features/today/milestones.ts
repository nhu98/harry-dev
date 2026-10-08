/** Monthly English checkpoints. EF SET score bands: A2 = 31–40, B1 = 41–50. */
export type Milestone = { month: string; label: string; efset: number; units: number; note: string };

export const MILESTONES: Milestone[] = [
  { month: "2026-10", label: "Tháng 10", efset: 0, units: 20, note: "EF SET lần 0 để biết điểm xuất phát. Unit 1–20." },
  { month: "2026-11", label: "Tháng 11", efset: 33, units: 40, note: "Gửi tin nhắn EN tự viết cho PO. Unit 21–40." },
  { month: "2026-12", label: "Tháng 12", efset: 35, units: 60, note: "Đề xuất đầu tiên với PO bằng EN. Unit 41–60." },
  { month: "2027-01", label: "Tháng 1 · mốc 3 tháng", efset: 37, units: 80, note: "Standup không cần soạn trước. Unit 61–80." },
  { month: "2027-02", label: "Tháng 2", efset: 39, units: 100, note: "Trình bày 1 tính năng 3 phút. Unit 81–100." },
  { month: "2027-03", label: "Tháng 3", efset: 40, units: 120, note: "Mock buổi review 3 lần. Unit 101–120." },
  { month: "2027-04", label: "Tháng 4 · mốc 6 tháng", efset: 41, units: 120, note: "B1. Review lương + role." },
];

export function milestoneFor(date: Date): Milestone {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return MILESTONES.find((m) => m.month === key) ?? MILESTONES[MILESTONES.length - 1];
}
