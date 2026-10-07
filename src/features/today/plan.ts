import { SITE } from "@/config/site";

export type Block = { time: string; title: string; how: string; links: { label: string; href: string }[] };
/** 0 = Sunday … 6 = Saturday */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const E11 = SITE.routes.docs("e11-huong-dan-tung-ngay");
const E8 = SITE.routes.docs("e8-ke-hoach-6-thang-review-thang-4");
const E7 = SITE.routes.docs("e7-ngan-hang-du-lieu-hang-ngay");
const E6 = SITE.routes.docs("e6-hoc-lieu-tieng-anh");

const LINKS = {
  bbc: { label: "BBC 6 Minute English", href: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
  wds: { label: "Web Dev Simplified", href: "https://www.youtube.com/@WebDevSimplified" },
  traversy: { label: "Traversy Media", href: "https://www.youtube.com/@TraversyMedia" },
  tv: { label: "Learn English with TV Series", href: "https://www.youtube.com/@LearnEnglishWithTVSeries" },
  youglish: { label: "YouGlish (phát âm)", href: "https://youglish.com" },
  anki: { label: "AnkiWeb", href: "https://ankiweb.net" },
  phrases: { label: "Câu mẫu EN", href: "/phrases" },
  assistant: { label: "Trợ lý AI", href: "/assistant" },
  guideVideo: { label: "Cách xem 3 lần", href: `${E11}#22-xem-3-lần-30-phút` },
  guidePE: { label: "Prompt gia sư Rails", href: `${E11}#t2-và-t4-đọc-1-endpoint-backend-với-ai-làm-gia-sư` },
  guideBrag: { label: "Brag doc + câu hỏi PO", href: `${E11}#t3-và-t5-brag-doc--1-câu-hỏi-cho-po` },
  guideChat: { label: "Prompt chat EN", href: `${E11}#41-chat-với-ai-bằng-tiếng-anh-25-phút` },
  guideSpeak: { label: "Cách nói với AI", href: `${E11}#t3-và-t4-voice-với-ai` },
  guideClass: { label: "Template lớp", href: `${E6}#7-template-chuẩn-bị-lớp-t2--t5-điền-trong-1520-phút-trước-lớp` },
  product3: { label: "3 dòng Product", href: `${E8}#31-3-dòng-product-trước-mỗi-task` },
  e7k2: { label: "Đề nói (E7 Kho 2)", href: `${E7}#kho-2--56-đề-nói-với-ai--tự-nói-1-phút-mỗi-tối-t3t4-lấy-1-đề-cn-tuỳ-hứng` },
  e7k3: { label: "Đề nhật ký (E7 Kho 3)", href: `${E7}#kho-3--40-đề-viết-3-câu-cuối-ngày-standup-diary--biến-thể` },
};

const morning: Block = { time: "8h00", title: "Nghe thụ động khi sửa soạn", how: "Bật loa 1 tập, không cần hiểu hết.", links: [LINKS.bbc] };
const product: Block = { time: "Sáng", title: "3 dòng Product trước task đầu tiên", how: "User goal / Simpler way / 1 câu hỏi cho PO. Comment vào task rồi mới code.", links: [LINKS.product3, LINKS.phrases] };
const nap: Block = { time: "13h00", title: "Nap 20 phút", how: "Báo thức 25 phút. Không nhìn điện thoại.", links: [] };
const vocab: Block = { time: "13h30", title: "Mochi 20p + Anki tech 10p", how: "Mochi hết lượt ôn thì mở Anki.", links: [LINKS.anki] };
const video = (channel: { label: string; href: string }, hint: string): Block => ({
  time: "14h00", title: "Nghe + nhại 45 phút (tai nghe)", how: `${hint} Lần 1 sub 0.75x, lần 2 chép 5 câu, lần 3 tắt sub. Thì thầm 5 câu, thu âm.`, links: [channel, LINKS.guideVideo, LINKS.youglish],
});
const chat = (topic: string): Block => ({ time: "15h30", title: "Chat gõ chữ với AI bằng EN", how: `Đề hôm nay: "${topic}". Gõ tay 10 lượt, cuối buổi xin bảng 3 lỗi.`, links: [LINKS.assistant, LINKS.guideChat, LINKS.e7k2] });
const diary: Block = { time: "17h35", title: "Nhật ký 3 câu EN", how: "Today I… / The hardest part was… / Tomorrow I will…", links: [LINKS.e7k3] };
const speak: Block = { time: "19h40", title: "Nói 20 phút với AI (voice)", how: "Đọc to 5 câu đã nhại, rồi nói 10 phút. Cuối hỏi 3 lỗi lớn nhất.", links: [LINKS.guideSpeak] };
const classPrep: Block = { time: "19h40", title: "Chuẩn bị lớp 15 phút", how: "Điền template: chủ đề + 5 câu định nói + 3 câu small talk. Lớp 20h–21h.", links: [LINKS.guideClass] };
const lights: Block = { time: "23h30", title: "Tắt đèn trước 24h", how: "Rời màn hình 23h30. Nghe podcast dễ cho buồn ngủ.", links: [] };

const peEndpoint: Block = { time: "14h45", title: "Học 1 endpoint backend với AI gia sư", how: "Dán prompt gia sư vào Claude Code trên repo backend. Trả lời 3 câu kiểm tra. Vẽ luồng ra giấy. Chép 5 dòng vào E9.", links: [LINKS.guidePE] };
const peBrag: Block = { time: "14h45", title: "Brag doc + 1 câu hỏi cho PO", how: "Ghi 1 dòng việc đã làm có bằng chứng. Soạn 1 câu hỏi why/who bằng EN và gửi trong ngày.", links: [LINKS.guideBrag, LINKS.phrases] };
const peReview: Block = { time: "14h45", title: "Tổng kết tuần 15 phút", how: "Trong Claude Code tại thư mục kho gõ /weekly-review. Ghi 3 việc tuần sau.", links: [LINKS.guideBrag] };

const weekdayChannel = [null, LINKS.traversy, LINKS.traversy, LINKS.wds, LINKS.wds, LINKS.tv, null] as const;
const chatTopics = ["", "Explain my app to a friend", "My team and my role", "What I did today at work", "A bug I fixed this week", "What I learned this week", ""];

export function planFor(day: Weekday): Block[] {
  if (day === 0 || day === 6) return [vocab];
  const pe = day === 5 ? peReview : day === 1 || day === 3 ? peEndpoint : peBrag;
  const evening = day === 1 || day === 4 ? classPrep : day === 5 ? null : speak;
  const ch = weekdayChannel[day]!;
  const hint = ch === LINKS.tv ? "Hôm nay giải trí: 1 clip phim có sub." : "1 video 8–12 phút, chủ đề React/JS đã biết.";
  return [morning, product, nap, vocab, video(ch, hint), pe, chat(chatTopics[day]), diary, ...(evening ? [evening] : []), lights];
}
