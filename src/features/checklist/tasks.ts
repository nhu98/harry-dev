import { SITE } from "@/config/site";

export type Task = { id: string; label: string; time: string; min?: boolean; how: string; guide: string };

const E11 = SITE.routes.docs("e11-huong-dan-tung-ngay");

/** Mirrors E5. `min` = 🔴 minimum items. `guide` deep-links into the E11 how-to doc. */
export const TASKS: Task[] = [
  { id: "listen-am", label: "Bật loa 1 tập BBC 6 Minute English khi sửa soạn", time: "8h00", how: "Mở BBC 6 Minute English, bấm play, không cần hiểu hết.", guide: `${E11}#1-8h00-sáng--nghe-thụ-động-khi-sửa-soạn-0-phút-tốn-thêm` },
  { id: "product-3-lines", label: "3 dòng Product trước task đầu tiên (user goal / simpler way / 1 câu hỏi cho PO)", time: "Sáng", min: true, how: "Comment 3 dòng vào task trên Linear trước khi code.", guide: `${E11}#6-sáng-trước-task-đầu-tiên--3-dòng-product-5-phút` },
  { id: "nap", label: "Power nap 20 phút", time: "13h00", min: true, how: "Báo thức 25 phút. Gục bàn. Không nhìn điện thoại.", guide: `${E11}#0-nếu-chỉ-làm-3-việc-ngày-lười-ngày-bận` },
  { id: "vocab", label: "Mochi 20p + Anki tech 10p", time: "13h30", min: true, how: "Mochi hết lượt ôn → mở Anki deck tech.", guide: `${E11}#0-nếu-chỉ-làm-3-việc-ngày-lười-ngày-bận` },
  { id: "video", label: "1 video tech 3 lần + chép 5 câu (tai nghe, im lặng)", time: "14h00", min: true, how: "Web Dev Simplified, 8–12 phút. Lần 1 sub 0.75x, lần 2 chép 5 câu, lần 3 tắt sub. Không nhại ở công ty.", guide: `${E11}#2-14h00--tiếng-anh-khối-1-nghe--nhại-với-tai-nghe-45-phút` },
  { id: "pe-block", label: "Khối Product Engineer: 1 endpoint backend với AI gia sư / brag doc", time: "14h45", min: true, how: "T2/T4: dán prompt gia sư vào Claude Code trên repo backend. T3/T5: brag doc + 1 câu hỏi cho PO. T6: /weekly-review.", guide: `${E11}#3-14h45--khối-product-engineer-45-phút` },
  { id: "grammar", label: "Ngữ pháp 15 phút: 1 unit Grammar in Use", time: "15h30", min: true, how: "Đọc trang trái, làm bài trang phải vào vở, dò đáp án.", guide: `${E11}#40-ngữ-pháp-15-phút-1-unitngày-15h3015h45` },
  { id: "chat-ai", label: "Chat gõ chữ với AI bằng EN 1 đề", time: "15h45", how: "Dán prompt tutor, gõ tay 10 lượt, xin bảng 3 lỗi.", guide: `${E11}#4-15h30--tiếng-anh-khối-2-viết--chat-gõ-chữ-45-phút-im-lặng-được` },
  { id: "diary", label: "Standup diary 3 câu EN", time: "17h35", min: true, how: "Today I… / The hardest part was… / Tomorrow I will…", guide: `${E11}#43-17h35--nhật-ký-3-câu-5-phút` },
  { id: "speak", label: "Ở nhà: nhại + nói với AI 30 phút (T6: 20 phút lúc 19h; T2/T5: chuẩn bị lớp)", time: "19h40", min: true, how: "T3/T4: nhại to 5 câu đã chép, thu âm, rồi voice với AI. T2/T5: điền template lớp.", guide: `${E11}#5-19h40--nói-20-phút-việc-duy-nhất-buổi-tối` },
  { id: "lights", label: "Tắt đèn trước 24h", time: "23h30", min: true, how: "23h30 rời màn hình. Nghe podcast dễ cho buồn ngủ.", guide: `${E11}#0-nếu-chỉ-làm-3-việc-ngày-lười-ngày-bận` },
];

export const MIN_TASKS = TASKS.filter((t) => t.min);
